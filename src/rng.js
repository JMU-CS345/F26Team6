// rng.js
// Seeded random number generation with independent streams per category.

// Small, fast seeded PRNG (mulberry32)
function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Turn a string like "enemies" into a number
function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

class RNGStream {
    constructor(seed) {
        this.next = mulberry32(seed);
    }

    float() { return this.next(); }                              // [0, 1)
    range(min, max) { return min + this.next() * (max - min); }
    int(min, max) { return Math.floor(this.range(min, max + 1)); } // inclusive
    chance(p) { return this.next() < p; }                        // chance(0.25) = 25%

    pick(array) { return array[this.int(0, array.length - 1)]; }

    // items: [{ item: "sword", weight: 5 }, { item: "gem", weight: 1 }]
    weighted(items) {
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            total += items[i].weight;
        }

        let roll = this.next() * total;
        for (let i = 0; i < items.length; i++) {
            roll -= items[i].weight;
            if (roll < 0) return items[i].item;
        }
        return items[items.length - 1].item;
    }
}

class GameRNG {
    constructor(masterSeed = Date.now()) {
        this.masterSeed = masterSeed;
        this.streams = {};
    }

    // Creates the stream on first use, then reuses it
    get(name) {
        if (!this.streams[name]) {
            this.streams[name] = new RNGStream(this.masterSeed ^ hashString(name));
        }
        return this.streams[name];
    }

    get enemies() { return this.get("enemies"); }
    get rewards() { return this.get("rewards"); }
}