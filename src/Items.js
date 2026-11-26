// items.js
// Master list of every item in the game. No logic here, just data.
// type: "weapon" | "shield" | "item"
// bonuses: flat amounts added to the player's base stats while equipped

const ITEMS = {
    "wooden-sword": { name: "Wooden Sword", type: "weapon", price: 30, bonuses: { attack: 3 } },
    "iron-sword": { name: "Iron Sword", type: "weapon", price: 70, bonuses: { attack: 6 } },
    "battle-axe": { name: "Battle Axe", type: "weapon", price: 90, bonuses: { attack: 9, speed: -1 } },

    "wooden-shield": { name: "Wooden Shield", type: "shield", price: 30, bonuses: { defense: 2 } },
    "iron-shield": { name: "Iron Shield", type: "shield", price: 70, bonuses: { defense: 5 } },

    "health-potion": { name: "Health Potion", type: "item", price: 20, bonuses: {} },
    "mana-potion": { name: "Mana Potion", type: "item", price: 20, bonuses: {} }
};

const EQUIPPABLE_TYPES = ["weapon", "shield"];

function isEquippable(itemId) {
    return EQUIPPABLE_TYPES.includes(ITEMS[itemId].type);
}