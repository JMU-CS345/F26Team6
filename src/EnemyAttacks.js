// EnemyAttacks.js
// Every enemy attack, defined once. Enemies reference these by id in Enemies.js.
//
// damage: [min, max]
// status: null = inflicts nothing
//         { id, chance (percent 0-100), turns: [min, max] }
// All numbers are placeholders - tune freely.
const ENEMY_ATTACKS = {
    // slimes
    roll: { name: "roll", damage: [3, 6], status: null },
    bigSlimeSlam: { name: "Big Slime Slam", damage: [10, 20], status: null },
    goopWave: { name: "Goop Wave", damage: [4, 7], status: { id: "poison", chance: 70, turns: [2, 3] } },
    crush: { name: "Crush", damage: [10, 15], status: { id: "bruise", chance: 70, turns: [2, 3] } },

    // pig
    headbutt: { name: "Headbutt", damage: [4, 7], status: null },
    charge: { name: "Charge", damage: [7, 10], status: { id: "bruise", chance: 70, turns: [2, 3] } },

    // rat
    bite: { name: "Bite", damage: [3, 5], status: { id: "bleed", chance: 10, turns: [1, 2] } },
    plagueBite: { name: "Plague Bite", damage: [2, 4], status: { id: "poison", chance: 40, turns: [2, 3] } },

    // ice-cube
    iceShard: { name: "Ice Shard", damage: [4, 6], status: null },
    frostTouch: { name: "Frost Touch", damage: [1, 3], status: { id: "freeze", chance: 40, turns: [1, 1] } },

    // skeleton
    boneSwipe: { name: "Bone Swipe", damage: [4, 7], status: null },
    boneThrow: { name: "Bone Throw", damage: [6, 9], status: null },

    // bee-swarm
    sting: { name: "Sting", damage: [1, 3], status: { id: "poison", chance: 25, turns: [2, 2] } },
};