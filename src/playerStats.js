// playerStats.js
// Base stats per mage, current equipment, and final stat calculation.

const MAGE_BASE_STATS = {
    fire: { maxHp: 200, maxMana: 60, attack: 8, defense: 3, speed: 5 }
    // ice: {...}, mind: {...} once those are designed
};

const PlayerStats = {
    mage: "fire",   // set once on the mage-select screen
    equipment: { weapon: null, shield: null },

    // Final value = base stat + bonuses from everything equipped.
    // Computed fresh every call, so nothing can drift out of sync.
    get(statName) {
        let total = MAGE_BASE_STATS[this.mage][statName] || 0;
        const slots = Object.keys(this.equipment);
        for (let i = 0; i < slots.length; i++) {
            const itemId = this.equipment[slots[i]];
            if (itemId !== null) {
                total += ITEMS[itemId].bonuses[statName] || 0;
            }
        }
        return total;
    },

    // Equips an owned weapon or shield. Returns true on success.
    equip(itemId) {
        const item = ITEMS[itemId];
        if (item === undefined || !isEquippable(itemId)) return false;
        if (Inventory.count(itemId) < 1) return false;
        this.equipment[item.type] = itemId;   // slot name matches item type
        return true;
    },

    unequip(slot) {
        this.equipment[slot] = null;
    }
};