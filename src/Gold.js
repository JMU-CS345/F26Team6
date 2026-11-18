// gold.js
// Player gold: tracking, add/subtract, the on-screen counter (top right),
// and battle rewards.
// Depends on rng.js and fights.js (load them first).

const Gold = {
    amount: 0,
    listeners: [],

    get() {
        return this.amount;
    },

    // Adds gold (e.g. battle reward). Amount must be positive.
    add(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error("Gold.add: amount must be a positive whole number");
        }
        this.amount += value;
        this.notify();
    },

    // Removes gold (e.g. buying something).
    // Returns true if spent, false if the player can't afford it (gold unchanged).
    subtract(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error("Gold.subtract: amount must be a positive whole number");
        }
        if (!this.canAfford(value)) {
            return false;
        }
        this.amount -= value;
        this.notify();
        return true;
    },

    canAfford(value) {
        return this.amount >= value;
    },

    // Call fn(newAmount) whenever gold changes
    onChange(fn) {
        this.listeners.push(fn);
    },

    notify() {
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i](this.amount);
        }
    },
};

// Creates the gold counter in the top-right corner of the screen.
// It updates itself whenever gold changes.
function createGoldDisplay() {
    const el = document.createElement("div");
    el.id = "gold-display";
    el.style.position = "fixed";
    el.style.top = "10px";
    el.style.right = "10px";
    el.style.padding = "6px 12px";
    el.style.background = "rgba(0, 0, 0, 0.6)";
    el.style.color = "#d4af37";
    el.style.font = "bold 18px sans-serif";
    el.style.borderRadius = "6px";
    el.style.zIndex = "1000";

    const update = (amount) => { el.textContent = "Gold: " + amount; };
    update(Gold.get());
    Gold.onChange(update);

    document.body.appendChild(el);
    return el;
}

// ---------- Battle rewards (uses FIGHT_TYPES and rollGold from fights.js) ----------

// Turns a difficulty label into its FIGHT_TYPES key.
// Accepts "mediumHard", "Medium Hard", "medium-hard", "MEDIUM_HARD", etc.
// Returns null if the label doesn't match any fight type.
function fightTypeFromLabel(label) {
    const cleaned = String(label).toLowerCase().replace(/[^a-z]/g, "");
    const names = Object.keys(FIGHT_TYPES);
    for (let i = 0; i < names.length; i++) {
        if (names[i].toLowerCase() === cleaned) {
            return names[i];
        }
    }
    return null;
}

// Call this when the player wins a fight.
// Looks up the fight's difficulty label, rolls gold in that range,
// adds it to the player's gold, and returns the amount awarded.
// `fightOrLabel` can be the fight object from generateFight()
// or just the difficulty label shown on screen (e.g. "Hard").
function awardFightGold(rng, fightOrLabel) {
    const label = typeof fightOrLabel === "string" ? fightOrLabel : fightOrLabel.fightType;
    const fightType = fightTypeFromLabel(label);
    if (fightType === null) {
        console.warn("awardFightGold: unknown difficulty label:", label);
        return 0;
    }

    const reward = rollGold(rng, FIGHT_TYPES[fightType]);
    Gold.add(reward);
    return reward;
}