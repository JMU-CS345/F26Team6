// fights.js
// Fight types, enemy pools, and generators.
// Depends on rng.js (load it first).

// weight = how common the fight is (relative, doesn't need to sum to 100)
// small / big = how many of each enemy size spawn
const FIGHT_TYPES = {
    superEasy: { weight: 5, small: 1, big: 0, gold: [5, 10] },
    easy: { weight: 25, small: 2, big: 0, gold: [5, 15] },
    medium: { weight: 30, small: 3, big: 0, gold: [10, 15] },
    mediumHard: { weight: 22, small: 0, big: 1, gold: [10, 20] },
    hard: { weight: 15, small: 2, big: 1, gold: [15, 25] },
    brutal: { weight: 3, small: 2, big: 2, gold: [50, 50] },
};

const ENEMY_POOLS = {
    small: ["slime", "pig", "rat", "ice-cube", "skeleton", "bee-swarm"],
    big: ["medium-slime", "block-slime"],
};

// Builds the weighted table for picking a fight type
function buildFightTable() {
    const names = Object.keys(FIGHT_TYPES);
    const table = [];
    for (let i = 0; i < names.length; i++) {
        table.push({ item: names[i], weight: FIGHT_TYPES[names[i]].weight });
    }
    return table;
}

const FIGHT_TABLE = buildFightTable();

// Picks a fight type and builds its list of enemies
function generateFight(rng) {
    const fightType = rng.enemies.weighted(FIGHT_TABLE);
    const def = FIGHT_TYPES[fightType];

    const enemies = [];
    for (let i = 0; i < def.big; i++) {
        enemies.push({ size: "big", type: rng.enemies.pick(ENEMY_POOLS.big) });
    }
    for (let i = 0; i < def.small; i++) {
        enemies.push({ size: "small", type: rng.enemies.pick(ENEMY_POOLS.small) });
    }

    return { fightType: fightType, enemies: enemies, gold: def.gold };
}

function rollGold(rng, fight) {
    return rng.rewards.int(fight.gold[0], fight.gold[1]);
}