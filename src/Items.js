// items.js
// Master list of every item in the game. No logic here, just data.
// type: "weapon" | "shield" | "item"
// bonuses: flat amounts added to the player's base stats while equipped

const ITEMS = {
    "sword": { name: "Sword", type: "weapon", price: 50, bonuses: { attack: 3 } },
    "axe": { name: "Axe", type: "weapon", price: 30, bonuses: { attack: 3 } },
    "scythe": { name: "Scythe", type: "weapon", price: 40, bonuses: { attack: 3 } },
    "ballAndChain": { name: "Ball and Chain", type: "weapon", price: 75, bonuses: { attack: 3 } },
    "hammer": { name: "Hammer", type: "weapon", price: 35, bonuses: { attack: 6 } },
    "boomerang": { name: "Boomerang", type: "weapon", price: 90, bonuses: { attack: 9 } },
    "dagger": { name: "Dagger", type: "weapon", price: 90, bonuses: { attack: 9 } },

    "woodenShield": { name: "Wooden Shield", type: "shield", price: 30, bonuses: { defense: 2 } },
    "basicShield": { name: "Basic Shield", type: "shield", price: 60, bonuses: { defense: 3 } },
    "frozenShield": { name: "Frozen Shield", type: "shield", price: 70, bonuses: { defense: 5 } },
    "hologramShield": { name: "Hologram Shield", type: "shield", price: 75, bonuses: { defense: 5 } },
    "garbageCanLid": { name: "Garbage Can Lid", type: "shield", price: 55, bonuses: { defense: 3 } },

    "healthPotion": { name: "Health Potion", type: "item", price: 20, bonuses: {} },
    "manaPotion": { name: "Mana Potion", type: "item", price: 20, bonuses: {} },
    "acidFlask": { name: "Acid Flask", type: "item", price: 40, bonuses: { damage: 100 } },
    "bomb": { name: "Bomb", type: "item", price: 20, bonuses: { damage: 50 } },
    "fairyBottle": { name: "Fairy in a Bottle", type: "item", price: 20, bonuses: { heal: 100 } },
    "strangeOrb": { name: "Strange Orb", type: "item", price: 20, bonuses: { damage: 100, heal: 200 } }
};

const EQUIPPABLE_TYPES = ["weapon", "shield"];

function isEquippable(itemId) {
    return EQUIPPABLE_TYPES.includes(ITEMS[itemId].type);
}