// Enemies.js
// Enemy definitions. Keys MUST match the ids in ENEMY_POOLS (fights.js).
// Depends on EnemyAttacks.js and StatusEffects.js.
//
// speed: higher goes earlier in the round
// attacks: weight = how often it picks that attack relative to its others.
//          A single-attack enemy just has one entry.
// All numbers are placeholders - tune freely.
const ENEMIES = {
    // ---- small ----
    "slime": {
        name: "Slime", maxHp: 25, speed: 4,
        attacks: [{ id: "roll", weight: 1 }]
    },

    "pig": {
        name: "Pig", maxHp: 35, speed: 6,
        attacks: [{ id: "headbutt", weight: 3 }, { id: "charge", weight: 1 }]
    },

    "rat": {
        name: "Rat", maxHp: 20, speed: 14,
        attacks: [{ id: "bite", weight: 3 }, { id: "plagueBite", weight: 1 }]
    },

    "ice-cube": {
        name: "Ice Cube", maxHp: 30, speed: 7,
        attacks: [{ id: "iceShard", weight: 2 }, { id: "frostTouch", weight: 1 }]
    },

    "skeleton": {
        name: "Skeleton", maxHp: 30, speed: 9,
        attacks: [{ id: "boneSwipe", weight: 2 }, { id: "boneThrow", weight: 1 }]
    },

    "bee-swarm": {
        name: "Bee Swarm", maxHp: 15, speed: 16,
        attacks: [{ id: "sting", weight: 1 }]
    },

    // ---- big ----
    "medium-slime": {
        name: "Medium Slime", maxHp: 90, speed: 3,
        attacks: [{ id: "bigSlimeSlam", weight: 3 }, { id: "goopWave", weight: 1 }]
    },

    "block-slime": {
        name: "Block Slime", maxHp: 120, speed: 2,
        attacks: [{ id: "crush", weight: 2 }, { id: "bigSlimeSlam", weight: 2 }]
    },
};

// Builds a fresh battle copy of an enemy so the definition is never modified
function createEnemy(type) {
    const def = ENEMIES[type];
    if (!def) {
        throw new Error("No enemy definition in ENEMIES for '" + type + "'");
    }
    return {
        type: type,
        name: def.name,
        hp: def.maxHp,
        maxHp: def.maxHp,
        speed: def.speed,
        statuses: [],
        isPlayer: false,
    };
}

// Turns generateFight(rng).enemies into real battle enemies.
// Duplicates get letters so the turn order is readable: "Rat A", "Rat B".
function createEnemiesForFight(fight) {
    const counts = {};
    for (let i = 0; i < fight.enemies.length; i++) {
        const type = fight.enemies[i].type;
        counts[type] = (counts[type] || 0) + 1;
    }

    const seen = {};
    const enemies = [];
    for (let i = 0; i < fight.enemies.length; i++) {
        const entry = fight.enemies[i];
        const enemy = createEnemy(entry.type);
        enemy.size = entry.size;

        if (counts[entry.type] > 1) {
            seen[entry.type] = (seen[entry.type] || 0) + 1;
            enemy.name += " " + String.fromCharCode(64 + seen[entry.type]); // A, B, C...
        }
        enemies.push(enemy);
    }
    return enemies;
}

// Weighted pick of one of the enemy's attacks (uses the same weighted() as fights.js)
function chooseEnemyAttack(enemy, stream) {
    const attacks = ENEMIES[enemy.type].attacks;
    const table = [];
    for (let i = 0; i < attacks.length; i++) {
        table.push({ item: attacks[i].id, weight: attacks[i].weight });
    }
    return ENEMY_ATTACKS[stream.weighted(table)];
}

// The enemy's action on its turn. Returns the message to show.
function enemyAct(enemy, stream) {
    const attack = chooseEnemyAttack(enemy, stream);

    let dmg = stream.int(attack.damage[0], attack.damage[1]);
    if (player.isBlocking) {
        dmg = Math.floor(dmg / 2);
    }
    damage(player, dmg);

    let message = enemy.name + " used " + attack.name + " for " + dmg + " damage";

    if (attack.status !== null && stream.int(1, 100) <= attack.status.chance) {
        const turns = stream.int(attack.status.turns[0], attack.status.turns[1]);
        applyStatus(player, attack.status.id, turns);
        message += " and inflicted " + STATUS_EFFECTS[attack.status.id].name;
    }

    return message + "!";
}