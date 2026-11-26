// inventory.js
// Shared inventory: { itemId: count }

const Inventory = {
    contents: {},

    add(itemId, count = 1) {
        if (ITEMS[itemId] === undefined) {
            throw new Error("Inventory.add: unknown item id " + itemId);
        }
        this.contents[itemId] = (this.contents[itemId] || 0) + count;
    },

    remove(itemId, count = 1) {
        if (this.count(itemId) < count) return false;
        this.contents[itemId] -= count;
        if (this.contents[itemId] === 0) delete this.contents[itemId];
        return true;
    },

    count(itemId) {
        return this.contents[itemId] || 0;
    },

    // All owned item ids, optionally filtered by type ("weapon", "shield", "item")
    list(type) {
        const ids = Object.keys(this.contents);
        const result = [];
        for (let i = 0; i < ids.length; i++) {
            if (type === undefined || ITEMS[ids[i]].type === type) {
                result.push(ids[i]);
            }
        }
        return result;
    }
};