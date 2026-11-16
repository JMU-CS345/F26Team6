// ---------- BASIC (PHYSICAL) ATTACKS ----------
// minDmg / maxDmg: damage range, accuracy: 0 to 1 chance to hit
const basicAttacks = [
    { name: "Punch", minDmg: 6, maxDmg: 10, accuracy: 0.95 },
    { name: "Kick", minDmg: 8, maxDmg: 14, accuracy: 0.85 },
    { name: "Uppercut", minDmg: 12, maxDmg: 20, accuracy: 0.70 },
    { name: "Elbow", minDmg: 9, maxDmg: 16, accuracy: 0.80 }
];

// The seeded stream used for all combat rolls.
// (rng is created in setup(), so we fetch the stream when needed.)
function combatRNG() {
    return rng.get("combat");
}

// ---------- USING AN ATTACK ----------
// Rolls the hit chance and damage, applies it to the target, and
// returns a result so you can show a message later.
function useBasicAttack(attack, target) {
    if (target === null) return { hit: false, amount: 0 };

    if (!combatRNG().chance(attack.accuracy)) {
        return { hit: false, amount: 0 };      // missed
    }

    const amount = combatRNG().int(attack.minDmg, attack.maxDmg);   // inclusive
    damage(target, amount);
    return { hit: true, amount: amount };
}

// Handy lookup by name, e.g. getBasicAttack("Punch")
function getBasicAttack(name) {
    for (let i = 0; i < basicAttacks.length; i++) {
        if (basicAttacks[i].name === name) return basicAttacks[i];
    }
    return null;
}