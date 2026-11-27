// StatusEffects.js
// Every status effect is just data. The turn system reads these fields,
// so adding a new status usually means adding one line here, no new code.
//
// Every status lists EVERY field (use the "does nothing" value if it doesn't apply):
// damagePerTurn         - damage taken at the start of the affected unit's turn (0 = none)
// skipsTurn             - the unit loses its turn while this is active (freeze)
// healMultiplier        - healing received is multiplied by this (0.5 = half healing, 1 = normal)
// damageTakenMultiplier - ALL damage the unit takes is multiplied by this (1.5 = +50%, 1 = normal)
// defaultTurns          - [min, max] duration used when applyStatus is called without a turn count
const STATUS_EFFECTS = {
    poison: { name: "Poison", damagePerTurn: 2, skipsTurn: false, healMultiplier: 0.5, damageTakenMultiplier: 1, defaultTurns: [2, 3] },
    burn: { name: "Burn", damagePerTurn: 6, skipsTurn: false, healMultiplier: 1, damageTakenMultiplier: 1, defaultTurns: [4, 5] }, // long DoT
    bleed: { name: "Bleed", damagePerTurn: 10, skipsTurn: false, healMultiplier: 1, damageTakenMultiplier: 1, defaultTurns: [1, 2] }, // short, heavy DoT
    freeze: { name: "Freeze", damagePerTurn: 0, skipsTurn: true, healMultiplier: 1, damageTakenMultiplier: 1, defaultTurns: [1, 1] },
    bruise: { name: "Bruise", damagePerTurn: 0, skipsTurn: false, healMultiplier: 1, damageTakenMultiplier: 1.5, defaultTurns: [2, 3] },
};

// Adds a status to a unit. Reapplying refreshes the duration instead of stacking.
// turns = how many of that unit's turns it lasts.
// Leave turns out to roll the status's defaultTurns instead (needs an rng stream).
function applyStatus(target, statusId, turns, stream) {
    if (turns === undefined) {
        const range = STATUS_EFFECTS[statusId].defaultTurns;
        turns = stream.int(range[0], range[1]);
    }

    for (let i = 0; i < target.statuses.length; i++) {
        if (target.statuses[i].id === statusId) {
            target.statuses[i].turnsLeft = Math.max(target.statuses[i].turnsLeft, turns);
            return;
        }
    }
    target.statuses.push({ id: statusId, turnsLeft: turns });
}

function hasStatus(target, statusId) {
    for (let i = 0; i < target.statuses.length; i++) {
        if (target.statuses[i].id === statusId) {
            return true;
        }
    }
    return false;
}

// Runs at the start of a unit's turn: deals damage-over-time, counts durations down,
// removes expired statuses. Returns true if the unit loses this turn (e.g. frozen).
// DoT goes through damage(), so Bruise boosts Burn/Bleed/Poison ticks too.
function processStatusesAtTurnStart(target) {
    let skipTurn = false;
    for (let i = target.statuses.length - 1; i >= 0; i--) {
        const status = target.statuses[i];
        const def = STATUS_EFFECTS[status.id];

        if (def.damagePerTurn > 0) {
            damage(target, def.damagePerTurn);
        }
        if (def.skipsTurn) {
            skipTurn = true;
        }

        status.turnsLeft--;
        if (status.turnsLeft <= 0) {
            target.statuses.splice(i, 1);
        }
    }
    return skipTurn;
}

// Multiply any healing by this. Poison makes it 0.5.
function getHealMultiplier(target) {
    let multiplier = 1;
    for (let i = 0; i < target.statuses.length; i++) {
        multiplier *= STATUS_EFFECTS[target.statuses[i].id].healMultiplier;
    }
    return multiplier;
}

// Multiply any damage taken by this. Bruise makes it 1.5.
function getDamageTakenMultiplier(target) {
    let multiplier = 1;
    for (let i = 0; i < target.statuses.length; i++) {
        multiplier *= STATUS_EFFECTS[target.statuses[i].id].damageTakenMultiplier;
    }
    return multiplier;
}

// Short text like " [Poison 2, Freeze 1]" for showing statuses on screen
function getStatusText(target) {
    if (target.statuses.length === 0) {
        return "";
    }
    const parts = [];
    for (let i = 0; i < target.statuses.length; i++) {
        const status = target.statuses[i];
        parts.push(STATUS_EFFECTS[status.id].name + " " + status.turnsLeft);
    }
    return " [" + parts.join(", ") + "]";
}