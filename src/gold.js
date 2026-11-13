/**
 * gold-system.js — player gold wallet, battle rewards and on-screen gold counter.
 * Single file, no dependencies.
 *
 * Usage in a page:   <script src="gold-system.js"></script>   (exposes window.GoldSystemKit)
 * Usage in Node/CJS: const { GoldSystem, grantBattleReward } = require('./gold-system.js');
 * Usage as ESM:      import './gold-system.js'; const { GoldSystem } = globalThis.GoldSystemKit;
 *
 *   const { GoldSystem, GoldCounter, grantBattleReward } = GoldSystemKit;
 *   const gold = new GoldSystem({ startingGold: 50 });
 *   new GoldCounter(gold, document.body);             // counter pinned top-right
 *
 *   // When a battle ends (each battleId is only ever paid once):
 *   const reward = grantBattleReward(gold, {
 *     battleId: 1, outcome: 'victory', enemies: [{ level: 3 }],
 *     difficulty: 'normal', damageTaken: 0,
 *   });
 *
 *   gold.spend(25, 'shop_purchase', { item: 'Potion' });  // false if unaffordable
 *
 *   localStorage.setItem('gold', JSON.stringify(gold));    // save
 *   const loaded = GoldSystem.fromJSON(JSON.parse(localStorage.getItem('gold'))); // load
 */
(function (root) {
'use strict';

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function isWholeNumber(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function assertWholeNumber(value, name) {
  if (!isWholeNumber(value)) {
    throw new RangeError(`${name} must be a non-negative integer, got ${describe(value)}`);
  }
}

function assertLabel(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${name} must be a non-empty string, got ${describe(value)}`);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function describe(value) {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || value === null || value === undefined) return String(value);
  return typeof value;
}

/** Deep copy of transaction metadata so callers can't rewrite history by mutating objects later. */
function cloneMeta(meta) {
  if (meta === undefined) return {};
  if (!isPlainObject(meta)) throw new TypeError(`meta must be a plain object, got ${describe(meta)}`);
  try {
    return typeof structuredClone === 'function' ? structuredClone(meta) : JSON.parse(JSON.stringify(meta));
  } catch (err) {
    throw new TypeError(`meta must contain only plain data (no functions, DOM nodes, etc.): ${err.message}`);
  }
}

function copyTransaction(tx) {
  return { ...tx, meta: cloneMeta(tx.meta) };
}

// ---------------------------------------------------------------------------
// GoldSystem — the single source of truth for the player's gold
// ---------------------------------------------------------------------------

/**
 * Guarantees:
 * - Balance is always an integer between 0 and maxGold.
 * - Every change is recorded as a transaction (trackable history).
 * - Subscribers are notified once per change, in order, even if a subscriber
 *   changes gold itself or throws an error.
 * - Rewards given with a rewardKey (e.g. a battle ID) can only be paid once.
 */
class GoldSystem {
  #balance;
  #maxGold;
  #historyLimit;
  #history = [];
  #listeners = new Set();
  #nextId = 1;
  #claimedRewards = new Set();
  #pending = [];
  #notifying = false;

  static DEFAULT_MAX_GOLD = 999_999_999;
  static DEFAULT_HISTORY_LIMIT = 100;
  static SAVE_VERSION = 1;

  constructor(options = {}) {
    if (!isPlainObject(options)) throw new TypeError('GoldSystem options must be an object');
    const {
      startingGold = 0,
      maxGold = GoldSystem.DEFAULT_MAX_GOLD,
      historyLimit = GoldSystem.DEFAULT_HISTORY_LIMIT,
    } = options;
    assertWholeNumber(startingGold, 'startingGold');
    assertWholeNumber(maxGold, 'maxGold');
    assertWholeNumber(historyLimit, 'historyLimit');
    if (maxGold === 0) throw new RangeError('maxGold must be greater than 0');
    if (startingGold > maxGold) {
      throw new RangeError(`startingGold (${startingGold}) cannot exceed maxGold (${maxGold})`);
    }
    this.#balance = startingGold;
    this.#maxGold = maxGold;
    this.#historyLimit = historyLimit;
  }

  get balance() { return this.#balance; }
  get maxGold() { return this.#maxGold; }
  get historyLimit() { return this.#historyLimit; }

  /** Copy of recent transactions, oldest first. Changing it does not affect the wallet. */
  get history() {
    return this.#history.map(copyTransaction);
  }

  canAfford(amount) {
    assertWholeNumber(amount, 'amount');
    return this.#balance >= amount;
  }

  /** True if a reward with this key has already been paid (see add's rewardKey option). */
  hasClaimed(rewardKey) {
    assertLabel(rewardKey, 'rewardKey');
    return this.#claimedRewards.has(rewardKey);
  }

  /**
   * Add gold (rewards, loot, selling items).
   * Returns the amount actually added: it can be less than requested when the wallet hits maxGold,
   * and is 0 when options.rewardKey has already been claimed.
   */
  add(amount, source = 'unknown', meta = undefined, options = {}) {
    assertWholeNumber(amount, 'amount');
    assertLabel(source, 'source');
    const metaCopy = cloneMeta(meta);
    const rewardKey = this.#readRewardKey(options);

    if (rewardKey !== undefined) {
      if (this.#claimedRewards.has(rewardKey)) return 0;
      this.#claimedRewards.add(rewardKey);
      metaCopy.rewardKey = rewardKey;
    }

    const applied = Math.min(amount, this.#maxGold - this.#balance);
    if (applied === 0) return 0;
    this.#apply(applied, 'credit', source, metaCopy);
    return applied;
  }

  /** Spend gold. Returns true on success; false (and no change at all) if the player can't afford it. */
  spend(amount, reason = 'unknown', meta = undefined) {
    assertWholeNumber(amount, 'amount');
    assertLabel(reason, 'reason');
    const metaCopy = cloneMeta(meta);
    if (this.#balance < amount) return false;
    if (amount > 0) this.#apply(-amount, 'debit', reason, metaCopy);
    return true;
  }

  /** Subscribe to changes. Callback receives (balance, transaction). Returns an unsubscribe function. */
  subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('listener must be a function');
    // Wrap so the same function can be subscribed twice and unsubscribed independently.
    const entry = { listener };
    this.#listeners.add(entry);
    return () => { this.#listeners.delete(entry); };
  }

  /** Plain object suitable for save files / localStorage (JSON.stringify calls this automatically). */
  toJSON() {
    return {
      version: GoldSystem.SAVE_VERSION,
      balance: this.#balance,
      history: this.history,
      claimedRewards: [...this.#claimedRewards],
    };
  }

  /**
   * Restore from toJSON() data. Throws a TypeError for missing or corrupt save data so the game can
   * decide what to do (e.g. start a fresh wallet). Malformed history entries are dropped.
   */
  static fromJSON(data, options = {}) {
    if (!isPlainObject(data)) throw new TypeError('Invalid gold save data: expected an object');
    if (!isPlainObject(options)) throw new TypeError('GoldSystem options must be an object');
    if (data.version !== undefined && data.version !== GoldSystem.SAVE_VERSION) {
      throw new TypeError(`Invalid gold save data: unsupported version ${describe(data.version)}`);
    }
    if (!isWholeNumber(data.balance)) {
      throw new TypeError(`Invalid gold save data: balance must be a non-negative integer, got ${describe(data.balance)}`);
    }
    const maxGold = options.maxGold ?? GoldSystem.DEFAULT_MAX_GOLD;
    if (isWholeNumber(maxGold) && data.balance > maxGold) {
      throw new TypeError(`Invalid gold save data: balance ${data.balance} exceeds maxGold ${maxGold}`);
    }

    const gold = new GoldSystem({ ...options, startingGold: data.balance });

    if (Array.isArray(data.history)) {
      const valid = data.history.filter(isValidTransaction).map(copyTransaction);
      gold.#history = gold.#historyLimit === 0 ? [] : valid.slice(-gold.#historyLimit);
      gold.#nextId = valid.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    }
    if (Array.isArray(data.claimedRewards)) {
      for (const key of data.claimedRewards) {
        if (typeof key === 'string' && key.trim() !== '') gold.#claimedRewards.add(key);
      }
    }
    return gold;
  }

  #readRewardKey(options) {
    if (!isPlainObject(options)) throw new TypeError('add options must be an object');
    if (options.rewardKey === undefined) return undefined;
    assertLabel(options.rewardKey, 'rewardKey');
    return options.rewardKey;
  }

  #apply(delta, type, source, meta) {
    this.#balance += delta;
    const tx = {
      id: this.#nextId++,
      type,
      amount: Math.abs(delta),
      source,
      meta,
      balanceAfter: this.#balance,
      timestamp: Date.now(),
    };
    if (this.#historyLimit > 0) {
      this.#history.push(tx);
      while (this.#history.length > this.#historyLimit) this.#history.shift();
    }
    this.#pending.push(tx);
    this.#flush();
  }

  /**
   * Delivers queued changes one at a time, in order. If a listener changes gold while being
   * notified, that change is queued and delivered after the current one has reached every
   * listener, so no listener is ever left with an out-of-date balance.
   */
  #flush() {
    if (this.#notifying) return;
    this.#notifying = true;
    try {
      while (this.#pending.length > 0) {
        const tx = this.#pending.shift();
        for (const entry of [...this.#listeners]) {
          if (!this.#listeners.has(entry)) continue; // unsubscribed by an earlier listener
          try {
            entry.listener(tx.balanceAfter, copyTransaction(tx));
          } catch (err) {
            // A broken listener (e.g. a UI bug) must not block other listeners or make the
            // caller think the gold change failed: it already happened.
            reportListenerError(err);
          }
        }
      }
    } finally {
      this.#notifying = false;
    }
  }
}

function isValidTransaction(t) {
  return isPlainObject(t)
    && Number.isSafeInteger(t.id) && t.id > 0
    && (t.type === 'credit' || t.type === 'debit')
    && isWholeNumber(t.amount)
    && isWholeNumber(t.balanceAfter)
    && typeof t.source === 'string'
    && (t.meta === undefined || isPlainObject(t.meta))
    && Number.isFinite(t.timestamp);
}

function reportListenerError(err) {
  if (typeof console !== 'undefined' && console.error) {
    console.error('[GoldSystem] a gold change listener threw an error:', err);
  }
}

// ---------------------------------------------------------------------------
// Battle rewards
// ---------------------------------------------------------------------------

/**
 * Gold is only paid for victories.
 *
 *   base  = round( sum(enemy.goldValue ?? enemy.level * GOLD_PER_LEVEL) * difficulty multiplier )
 *   bonus = round( base * FLAWLESS_BONUS_RATE )   only when damageTaken is exactly 0
 *   total = base + bonus
 */
const GOLD_PER_LEVEL = 5;
const FLAWLESS_BONUS_RATE = 0.25;
const DIFFICULTY_MULTIPLIER = Object.freeze({ easy: 0.75, normal: 1, hard: 1.5 });
const BATTLE_OUTCOMES = Object.freeze(['victory', 'defeat', 'fled']);

function enemyGold(enemy, index) {
  if (!isPlainObject(enemy)) throw new TypeError(`enemies[${index}] must be an object`);
  if (enemy.goldValue !== undefined) {
    if (typeof enemy.goldValue !== 'number' || !Number.isFinite(enemy.goldValue) || enemy.goldValue < 0) {
      throw new RangeError(`enemies[${index}].goldValue must be a non-negative number, got ${describe(enemy.goldValue)}`);
    }
    return enemy.goldValue;
  }
  const level = enemy.level ?? 1;
  if (typeof level !== 'number' || !Number.isFinite(level) || level < 0) {
    throw new RangeError(`enemies[${index}].level must be a non-negative number, got ${describe(level)}`);
  }
  return level * GOLD_PER_LEVEL;
}

/** Pure calculation: works out the reward without touching any wallet. */
function calculateBattleReward(battleResult) {
  if (!isPlainObject(battleResult)) throw new TypeError('battleResult must be an object');
  const { outcome, enemies = [], difficulty = 'normal', damageTaken } = battleResult;

  if (!BATTLE_OUTCOMES.includes(outcome)) {
    throw new RangeError(`outcome must be one of ${BATTLE_OUTCOMES.join(', ')}, got ${describe(outcome)}`);
  }
  if (!Object.prototype.hasOwnProperty.call(DIFFICULTY_MULTIPLIER, difficulty)) {
    throw new RangeError(`difficulty must be one of ${Object.keys(DIFFICULTY_MULTIPLIER).join(', ')}, got ${describe(difficulty)}`);
  }
  if (!Array.isArray(enemies)) throw new TypeError('enemies must be an array');
  if (damageTaken !== undefined
      && (typeof damageTaken !== 'number' || !Number.isFinite(damageTaken) || damageTaken < 0)) {
    throw new RangeError(`damageTaken must be a non-negative number, got ${describe(damageTaken)}`);
  }

  if (outcome !== 'victory') return { base: 0, bonus: 0, total: 0 };

  const raw = enemies.reduce((sum, enemy, i) => sum + enemyGold(enemy, i), 0);
  const base = Math.round(raw * DIFFICULTY_MULTIPLIER[difficulty]);
  const bonus = damageTaken === 0 ? Math.round(base * FLAWLESS_BONUS_RATE) : 0;
  const total = base + bonus;
  if (!Number.isSafeInteger(total)) throw new RangeError(`battle reward is too large: ${total}`);
  return { base, bonus, total };
}

/**
 * Call when a battle ends. Credits the wallet and returns the breakdown for a results screen:
 *   { base, bonus, total, granted, alreadyClaimed }
 * granted can be lower than total if the wallet is near maxGold. A battleId is required, and the same
 * battleId is never paid twice (alreadyClaimed: true, granted: 0), even after saving and loading.
 */
function grantBattleReward(goldSystem, battleResult) {
  if (!(goldSystem instanceof GoldSystem)) throw new TypeError('goldSystem must be a GoldSystem');
  if (!isPlainObject(battleResult)) throw new TypeError('battleResult must be an object');
  const { battleId } = battleResult;
  const idOk = (typeof battleId === 'string' && battleId.trim() !== '')
    || (typeof battleId === 'number' && Number.isFinite(battleId));
  if (!idOk) throw new TypeError(`battleId must be a non-empty string or a number, got ${describe(battleId)}`);

  const reward = calculateBattleReward(battleResult);
  const rewardKey = `battle:${battleId}`;
  if (goldSystem.hasClaimed(rewardKey)) return { ...reward, granted: 0, alreadyClaimed: true };

  const granted = goldSystem.add(
    reward.total,
    'battle_reward',
    { battleId, outcome: battleResult.outcome, base: reward.base, bonus: reward.bonus },
    { rewardKey },
  );
  return { ...reward, granted, alreadyClaimed: false };
}

// ---------------------------------------------------------------------------
// GoldCounter — on-screen HUD
// ---------------------------------------------------------------------------

function formatGold(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) throw new TypeError(`formatGold expects a number, got ${describe(n)}`);
  return Math.round(n).toLocaleString('en-US');
}

const GOLD_COUNTER_CSS = `
.gold-counter { position:relative; display:inline-flex; align-items:center; gap:8px; padding:8px 14px;
  background:rgba(0,0,0,.6); border:2px solid #f5c542; border-radius:999px; color:#f5c542;
  font:700 20px/1.2 system-ui, sans-serif; font-variant-numeric:tabular-nums; white-space:nowrap; }
.gold-counter--fixed { position:fixed; top:16px; right:16px; z-index:1000; }
.gold-counter__icon { flex:none; width:20px; height:20px; border-radius:50%;
  background:radial-gradient(circle at 35% 35%, #fff3b0, #f5c542 45%, #b8860b); box-shadow:0 0 0 2px #8a6508 inset; }
.gold-counter__delta { position:absolute; right:12px; top:100%; font-size:16px; pointer-events:none;
  animation:gold-counter-float 1.1s ease-out forwards; }
.gold-counter__delta.is-gain { color:#5fd38d; }
.gold-counter__delta.is-loss { color:#ff6b6b; }
@keyframes gold-counter-float { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(24px); } }
@media (prefers-reduced-motion: reduce) { .gold-counter__delta { animation:none; } }
.gold-counter .visually-hidden { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
`;

const MAX_VISIBLE_DELTAS = 5;
const DELTA_LIFETIME_MS = 1200;

function injectGoldCounterStyles(doc) {
  if (doc.getElementById('gold-counter-styles')) return;
  const style = doc.createElement('style');
  style.id = 'gold-counter-styles';
  style.textContent = GOLD_COUNTER_CSS;
  (doc.head || doc.documentElement).appendChild(style);
}

function prefersReducedMotion() {
  try {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Shows the player's gold and keeps it in sync with a GoldSystem automatically.
 * The number counts toward each new balance and a +N / -N indicator floats under it.
 * Mount it on document.body to pin it to the top-right corner, or on your own HUD element.
 */
class GoldCounter {
  #gold;
  #raf = 0;
  #timers = new Set();
  #unsubscribe;
  #destroyed = false;

  constructor(goldSystem, container, options = {}) {
    if (typeof document === 'undefined') {
      throw new Error('GoldCounter needs a browser DOM (document is not defined)');
    }
    if (!(goldSystem instanceof GoldSystem)) throw new TypeError('goldSystem must be a GoldSystem');
    if (!container || typeof container.appendChild !== 'function' || container.nodeType !== 1) {
      throw new TypeError('container must be a DOM element, e.g. document.body');
    }
    if (!isPlainObject(options)) throw new TypeError('GoldCounter options must be an object');
    const { animationMs = 400 } = options;
    if (typeof animationMs !== 'number' || !Number.isFinite(animationMs) || animationMs < 0) {
      throw new RangeError(`animationMs must be a non-negative number, got ${describe(animationMs)}`);
    }

    this.#gold = goldSystem;
    this.animationMs = animationMs;
    this.displayed = goldSystem.balance;

    const doc = container.ownerDocument || document;
    injectGoldCounterStyles(doc);
    this.el = doc.createElement('div');
    this.el.className = 'gold-counter';
    if (container === doc.body) this.el.classList.add('gold-counter--fixed');
    this.el.setAttribute('role', 'status');

    const icon = doc.createElement('span');
    icon.className = 'gold-counter__icon';
    icon.setAttribute('aria-hidden', 'true');
    this.valueEl = doc.createElement('span');
    this.valueEl.className = 'gold-counter__value';
    const label = doc.createElement('span');
    label.className = 'visually-hidden';
    label.textContent = ' gold';
    this.el.append(icon, this.valueEl, label);

    this.#render(this.displayed);
    this.el.setAttribute('aria-label', `${formatGold(goldSystem.balance)} gold`);
    container.appendChild(this.el);

    this.#unsubscribe = goldSystem.subscribe((balance, tx) => this.#onChange(balance, tx));
  }

  /** The balance the counter is heading toward (always the wallet's real balance). */
  get target() {
    return this.#gold.balance;
  }

  get destroyed() {
    return this.#destroyed;
  }

  destroy() {
    if (this.#destroyed) return;
    this.#destroyed = true;
    this.#unsubscribe();
    this.#cancelAnimation();
    for (const id of this.#timers) clearTimeout(id);
    this.#timers.clear();
    this.el.remove();
  }

  #onChange(balance, tx) {
    if (this.#destroyed) return;
    this.el.setAttribute('aria-label', `${formatGold(balance)} gold`);
    this.#popDelta(tx);
    this.#animateTo(balance);
  }

  #render(value) {
    this.displayed = value;
    this.valueEl.textContent = formatGold(value);
  }

  #cancelAnimation() {
    if (this.#raf && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(this.#raf);
    this.#raf = 0;
  }

  #animateTo(target) {
    this.#cancelAnimation();
    const duration = this.animationMs;
    if (duration === 0 || prefersReducedMotion() || typeof requestAnimationFrame !== 'function') {
      this.#render(target);
      return;
    }
    const from = this.displayed;
    let start = null;
    const step = (now) => {
      if (this.#destroyed) return;
      if (start === null) start = now;
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - (1 - t) ** 3;
      // Always land exactly on the target at the end, never on a rounding neighbour.
      this.#render(t >= 1 ? target : Math.round(from + (target - from) * eased));
      this.#raf = t < 1 ? requestAnimationFrame(step) : 0;
    };
    this.#raf = requestAnimationFrame(step);
  }

  #popDelta(tx) {
    const doc = this.el.ownerDocument;
    const pops = this.el.querySelectorAll('.gold-counter__delta');
    for (let i = 0; i <= pops.length - MAX_VISIBLE_DELTAS; i++) pops[i].remove();

    const pop = doc.createElement('span');
    const gain = tx.type === 'credit';
    pop.className = `gold-counter__delta ${gain ? 'is-gain' : 'is-loss'}`;
    pop.textContent = `${gain ? '+' : '-'}${formatGold(tx.amount)}`;
    pop.setAttribute('aria-hidden', 'true');
    this.el.appendChild(pop);

    // Remove after the float animation; the timer also covers browsers/settings where
    // animationend never fires (reduced motion, hidden tabs, animations disabled).
    const remove = () => {
      clearTimeout(timer);
      this.#timers.delete(timer);
      pop.remove();
    };
    const timer = setTimeout(remove, DELTA_LIFETIME_MS);
    this.#timers.add(timer);
    pop.addEventListener('animationend', remove, { once: true });
  }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

const GoldSystemKit = Object.freeze({
  GoldSystem,
  GoldCounter,
  formatGold,
  calculateBattleReward,
  grantBattleReward,
  GOLD_PER_LEVEL,
  FLAWLESS_BONUS_RATE,
  DIFFICULTY_MULTIPLIER,
  BATTLE_OUTCOMES,
});

if (typeof module !== 'undefined' && module && module.exports) module.exports = GoldSystemKit;
if (root) root.GoldSystemKit = GoldSystemKit;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
