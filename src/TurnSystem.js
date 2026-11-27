// TurnSystem.js
// Rounds and turn order. Each round, every living unit (player + enemies)
// gets one turn, highest speed first. Ties: the player goes first.
// A banner in the middle of the screen announces whose turn it is,
// then shows what happened after each action.
// Depends on Enemies.js, StatusEffects.js, HealthSystem.js.

const TURN_BANNER_TIME = 1000; // ms the "X's turn" banner stays up
const ACTION_BANNER_TIME = 1500; // ms the "what happened" banner stays up
const BANNER_FADE_TIME = 250; // ms of fade-in / fade-out at each end

const battle = {
    enemies: [],
    turnOrder: [],
    turnIndex: 0,
    round: 0,
    waitingForPlayer: false,
    over: false,
    message: "",
    rng: null,
    pendingAction: null,
    nextActionTime: 0,
    banner: null, // { text, startTime, duration }
    active: false, // true while a battle is running
};

// Player uses a basic attack on the currently targeted enemy, then the turn ends.
// Wraps your existing useBasicAttack so it doesn't need changing.
function playerUseBasicAttack(attack) {
    if (!isPlayerTurn()) return;

    const target = getTargetEnemy();
    if (target === null) return;

    const hpBefore = target.hp;
    useBasicAttack(attack, target);
    const dealt = hpBefore - target.hp;

    endPlayerTurn("You used " + attack.name + " on " + target.name + " for " + dealt + " damage!");
}

// TODO: point this at your PlayerStats once speed lives there
function getPlayerSpeed() {
    if (typeof PlayerStats !== "undefined" && typeof PlayerStats.speed === "number") {
        return PlayerStats.speed;
    }
    return 10;
}

// Uses an rng.combat stream if you have one, otherwise falls back to rng.enemies
function getCombatStream() {
    return battle.rng.combat || battle.rng.enemies;
}

// Call once when a battle starts.
// enemies = createEnemiesForFight(fight), rng = the same rng you pass to generateFight
function startBattleRounds(enemies, rng) {
    battle.enemies = enemies;
    battle.rng = rng;
    battle.round = 0;
    battle.over = false;
    battle.waitingForPlayer = false;
    battle.pendingAction = null;
    battle.banner = null;
    battle.active = true;

    player.name = "You";
    player.isPlayer = true;
    player.isBlocking = false;
    player.statuses = [];
    player.speed = getPlayerSpeed();

    startNewRound();
}

// ---------- banner ----------

// Shows text in the middle of the screen for `duration` ms.
// Also becomes the latest line in the top-left message.
function showBanner(text, duration) {
    battle.banner = { text: text, startTime: millis(), duration: duration };
    battle.message = text;
}

function isBannerShowing() {
    return battle.banner !== null && millis() - battle.banner.startTime < battle.banner.duration;
}

// Call every frame from drawBattleScreen(), AFTER drawing everything else so it's on top
function drawBattleBanner() {
    if (!isBannerShowing()) return;

    const elapsed = millis() - battle.banner.startTime;
    const remaining = battle.banner.duration - elapsed;

    // Fade in at the start, fade out at the end
    let alpha = 1;
    if (elapsed < BANNER_FADE_TIME) {
        alpha = elapsed / BANNER_FADE_TIME;
    } else if (remaining < BANNER_FADE_TIME) {
        alpha = remaining / BANNER_FADE_TIME;
    }

    push();
    noStroke();
    rectMode(CENTER);
    fill(0, 0, 0, 180 * alpha);
    rect(width / 2, 250, width, 70);

    fill(255, 255, 255, 255 * alpha);
    textAlign(CENTER, CENTER);
    textSize(28);
    text(battle.banner.text, width / 2, 250);
    pop();
}

// ---------- timing ----------

// Run something after `delay` ms (checked in updateBattle)
function scheduleAction(fn, delay) {
    battle.pendingAction = fn;
    battle.nextActionTime = millis() + delay;
}

// Call every frame from drawBattleScreen()
function updateBattle() {
    if (battle.pendingAction !== null && millis() >= battle.nextActionTime) {
        const action = battle.pendingAction;
        battle.pendingAction = null;
        action();
    }
}

// ---------- rounds and turns ----------

function startNewRound() {
    battle.round++;

    const units = [];
    if (!isDead(player)) {
        units.push(player);
    }
    for (let i = 0; i < battle.enemies.length; i++) {
        if (!isDead(battle.enemies[i])) {
            units.push(battle.enemies[i]);
        }
    }

    // Highest speed first; on a tie the player goes first
    units.sort(function (a, b) {
        if (b.speed !== a.speed) return b.speed - a.speed;
        if (a.isPlayer) return -1;
        if (b.isPlayer) return 1;
        return 0;
    });

    battle.turnOrder = units;
    battle.turnIndex = -1;
    advanceTurn();
}

// Moves to the next living unit in the order, or starts a new round
function advanceTurn() {
    if (checkBattleOver()) return;

    battle.turnIndex++;
    if (battle.turnIndex >= battle.turnOrder.length) {
        startNewRound();
        return;
    }

    const unit = battle.turnOrder[battle.turnIndex];
    if (isDead(unit)) {
        advanceTurn(); // died earlier this round, skip it
        return;
    }
    beginTurn(unit);
}

function beginTurn(unit) {
    // Block lasts until the player's next turn
    if (unit.isPlayer) {
        unit.isBlocking = false;
    }

    const skipTurn = processStatusesAtTurnStart(unit);

    if (isDead(unit)) {
        showBanner(unit.name + (unit.isPlayer ? " succumb" : " succumbs") + " to status damage!", ACTION_BANNER_TIME);
        scheduleAction(advanceTurn, ACTION_BANNER_TIME);
        return;
    }

    if (skipTurn) {
        showBanner(unit.name + (unit.isPlayer ? " are" : " is") + " frozen and can't move!", ACTION_BANNER_TIME);
        scheduleAction(advanceTurn, ACTION_BANNER_TIME);
        return;
    }

    if (unit.isPlayer) {
        // Banner first, then the attack menu unlocks
        showBanner("Your turn!", TURN_BANNER_TIME);
        scheduleAction(function () {
            battle.waitingForPlayer = true;
        }, TURN_BANNER_TIME);
        return;
    }

    // Enemy: "X's turn" banner -> it acts -> "what happened" banner -> next turn
    showBanner(unit.name + "'s turn!", TURN_BANNER_TIME);
    scheduleAction(function () {
        showBanner(enemyAct(unit, getCombatStream()), ACTION_BANNER_TIME);
        scheduleAction(advanceTurn, ACTION_BANNER_TIME);
    }, TURN_BANNER_TIME);
}

// Is the attack menu allowed to take input right now?
function isPlayerTurn() {
    return battle.waitingForPlayer && !battle.over;
}

// Call this at the end of EVERY player action (attack, magic, block, item)
// with a message saying what happened, e.g. "You used Punch on Rat A for 6 damage!"
function endPlayerTurn(message) {
    battle.waitingForPlayer = false;
    gameState.battleMenu = "main"; // menu goes back to the 4 options for next turn
    showBanner(message, ACTION_BANNER_TIME);
    scheduleAction(advanceTurn, ACTION_BANNER_TIME);
}

function checkBattleOver() {
    if (battle.over) return true;

    if (isDead(player)) {
        battle.over = true;
        showBanner("You were defeated...", ACTION_BANNER_TIME);
        scheduleAction(function () {
            battle.active = false;
            onPlayerDefeated();
        }, ACTION_BANNER_TIME);
        return true;
    }

    for (let i = 0; i < battle.enemies.length; i++) {
        if (!isDead(battle.enemies[i])) {
            return false;
        }
    }

    battle.over = true;
    showBanner("Victory!", ACTION_BANNER_TIME);
    scheduleAction(function () {
        battle.active = false;
        endBattle(); // your existing endBattle -> victory screen + gold
    }, ACTION_BANNER_TIME);
    return true;
}

// TODO: swap for a real game over screen
function onPlayerDefeated() {
    currentFight = null;   // so the next trip to "battle" starts a fresh fight
    battleEnemies = [];
    resetBattleHealth();
    gameState.screen = "title";
}

// Round number, latest message, and the turn order (current unit highlighted)
function drawTurnInfo() {
    push();
    textAlign(LEFT, TOP);
    fill(255);
    textSize(18);
    text("Round " + battle.round, 20, 20);
    textSize(16);
    text(battle.message, 20, 48);

    textAlign(RIGHT, TOP);
    fill(255);
    text("Turn order", 980, 20);
    for (let i = 0; i < battle.turnOrder.length; i++) {
        const unit = battle.turnOrder[i];
        if (isDead(unit)) {
            fill(110);
        } else if (i === battle.turnIndex) {
            fill(255, 220, 80);
        } else {
            fill(200);
        }
        text(unit.name + " (" + unit.speed + ")" + getStatusText(unit), 980, 46 + i * 22);
    }
    pop();
}