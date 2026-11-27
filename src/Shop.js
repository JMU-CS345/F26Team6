// Shop.js

const SHOP_ITEM_COUNT = 6;
const SHOP_COLUMNS = 3;
const EQUIP_PER_PAGE = 7;

// Item types that can only be bought once per run.
// Remove "item" from this list if you want potions/flasks to be able to restock.
const SHOP_ONE_TIME_TYPES = ["weapon", "shield", "item"];

// ids must match the keys in your global ITEMS table
const SHOP_ITEM_POOL = [
    { id: "sword", name: "Sword", price: 50, type: "weapon" },
    { id: "hammer", name: "Hammer", price: 35, type: "weapon" },
    { id: "basicShield", name: "Basic Shield", price: 60, type: "shield" },
    { id: "scythe", name: "Scythe", price: 40, type: "weapon" },
    { id: "ballAndChain", name: "Ball and Chain", price: 75, type: "weapon" },
    { id: "hologramShield", name: "Hologram Shield", price: 75, type: "shield" },
    { id: "healthPotion", name: "Health Potion", price: 20, type: "item" },
    { id: "acidFlask", name: "Acid Flask", price: 40, type: "item" },
    { id: "manaPotion", name: "Mana Potion", price: 20, type: "item" },
    { id: "dagger", name: "Dagger", price: 90, type: "weapon" },
    { id: "garbageCanLid", name: "Garbage Can Lid", price: 55, type: "shield" }
];

let shopStock = null;                 // null means "needs to be rolled"
let shopPurchased = {};               // ids bought this run, e.g. { sword: true }
// modes: "menu", "buying", "equipChoice", "equipList",
// or a one-frame action like "buy:2", "pick:weapon", "equip:0"
let shopState = { mode: "menu", equipPage: 0, equipType: "weapon" };
let shopMessage = "";
let shopMessageUntil = 0;             // millis() time when the message disappears
let shopLastFrame = -2;               // frame the shop was last drawn, used to detect a fresh entry

// Call this when a new run starts so purchased items can appear in shops again
function resetShopProgress() {
    shopPurchased = {};
    shopStock = null;
}

// ---------- RNG ----------

// ONE place to connect your seeded mulberry32 stream.
// Must return a float from 0 (inclusive) to 1 (exclusive).
// Replace the GameRNG.next() call with whatever your GameRNG exposes.
function shopRandom() {
    if (typeof GameRNG !== "undefined" && typeof GameRNG.next === "function") {
        return GameRNG.next();
    }
    return Math.random();   // fallback so the shop still works if the hook isn't connected yet
}

function shopRandInt(max) {
    const n = Math.floor(shopRandom() * max);
    // guard: if the rng hook returns something outside 0..1, don't break the shuffle
    if (!(n >= 0 && n < max)) {
        return Math.floor(Math.random() * max);
    }
    return n;
}

// ---------- Stock ----------

function rollShopStock() {
    // copy the pool, skipping anything already bought this run
    const pool = [];
    for (let i = 0; i < SHOP_ITEM_POOL.length; i++) {
        const entry = SHOP_ITEM_POOL[i];
        const boughtForever = shopPurchased[entry.id] === true &&
            SHOP_ONE_TIME_TYPES.includes(entry.type);
        if (!boughtForever) {
            pool.push({ ...entry, sold: false });
        }
    }

    // the pool can run low late in a run, so never ask for more than we have
    const count = Math.min(SHOP_ITEM_COUNT, pool.length);

    // partial Fisher-Yates shuffle, picks `count` unique items
    for (let i = 0; i < count; i++) {
        const j = i + shopRandInt(pool.length - i);
        const temp = pool[i];
        pool[i] = pool[j];
        pool[j] = temp;
    }

    shopStock = pool.slice(0, count);
    shopState.mode = "menu";
    shopState.equipPage = 0;
    shopState.equipType = "weapon";
    shopMessage = "";
}

function showShopMessage(msg) {
    shopMessage = msg;
    shopMessageUntil = millis() + 1500;
}

// ---------- Layout ----------

// Item cards: 3x2 grid in the blank area, left of the buttons
function shopCardRect(i) {
    const col = i % SHOP_COLUMNS;
    const row = Math.floor(i / SHOP_COLUMNS);
    return { x: 40 + col * 235, y: 300 + row * 145, w: 220, h: 130 };
}

// Equip list rows: stacked in the same blank area
function equipRowRect(i) {
    return { x: 40, y: 300 + i * 40, w: 700, h: 36 };
}

// Buttons: right side, stacked
const SHOP_BUTTONS = {
    buy: { x: 780, y: 310, w: 180, h: 50 },
    equip: { x: 780, y: 380, w: 180, h: 50 },
    leave: { x: 780, y: 450, w: 180, h: 50 },
    back: { x: 780, y: 450, w: 180, h: 50 },     // same spot as Leave, shown while buying/equipping
    weapon: { x: 780, y: 310, w: 180, h: 50 },   // equip choice screen
    shield: { x: 780, y: 380, w: 180, h: 50 },
    prev: { x: 780, y: 310, w: 180, h: 50 },     // only shown on the equip list with 2+ pages
    next: { x: 780, y: 380, w: 180, h: 50 }
};

// ---------- Equip helpers ----------

// Owned equipment of ONE type ("weapon" or "shield"), rebuilt each call so it never goes stale
function getEquipList(type) {
    const ids = Object.keys(ITEMS);
    const list = [];
    for (let i = 0; i < ids.length; i++) {
        if (isEquippable(ids[i]) && ITEMS[ids[i]].type === type &&
            Inventory.count(ids[i]) >= 1) {
            list.push(ids[i]);
        }
    }
    return list;
}

function equipPageCount(type) {
    return Math.max(1, Math.ceil(getEquipList(type).length / EQUIP_PER_PAGE));
}

function equippedName(slot) {
    const id = PlayerStats.equipment[slot];
    return (id === null || id === undefined) ? "none" : ITEMS[id].name;
}

function bonusText(itemId) {
    const bonuses = ITEMS[itemId].bonuses;
    const keys = Object.keys(bonuses);
    let s = "";
    for (let i = 0; i < keys.length; i++) {
        const v = bonuses[keys[i]];
        s += (i > 0 ? "   " : "") + keys[i] + " " + (v >= 0 ? "+" : "") + v;
    }
    return s;
}

// ---------- Actions ----------

// Handles whatever the buttons set shopState.mode to
function processShopAction() {
    const mode = shopState.mode;

    if (mode.startsWith("buy:")) {
        const i = parseInt(mode.split(":")[1]);
        const item = shopStock[i];

        if (item === undefined) {
            shopState.mode = "buying";
        } else if (item.sold) {
            showShopMessage("Already sold!");
            shopState.mode = "buying";   // stay so they can pick another item
            window._btnIndex = i;        // keep the cursor on the same card
        } else if (ITEMS[item.id] === undefined) {
            // id doesn't match your ITEMS table, so don't take the gold
            showShopMessage("Unknown item id: " + item.id);
            shopState.mode = "menu";
        } else if (Gold.subtract(item.price)) {
            item.sold = true;
            shopPurchased[item.id] = true;   // never offered again this run
            shopState.mode = "menu";         // reset first so a bad inventory call can't freeze the buttons
            try {
                Inventory.add(item.id);
                showShopMessage("Purchased " + item.name + "!");
            } catch (err) {
                console.error(err);
                showShopMessage("Inventory error: " + err.message);
            }
        } else {
            showShopMessage("Not enough gold!");
            shopState.mode = "menu";
        }
    }
    else if (mode.startsWith("pick:")) {
        // chose Weapon or Shield on the equip choice screen
        shopState.equipType = mode.split(":")[1];
        shopState.equipPage = 0;
        shopState.mode = "equipList";
    }
    else if (mode.startsWith("equip:")) {
        const row = parseInt(mode.split(":")[1]);
        const list = getEquipList(shopState.equipType);
        const id = list[shopState.equipPage * EQUIP_PER_PAGE + row];

        if (id === undefined || !PlayerStats.equip(id)) {
            showShopMessage("Couldn't equip that!");
        }
        // stay on the list: the EQUIPPED tag moves to the chosen item
        shopState.mode = "equipList";
        window._btnIndex = row;      // keep the cursor on the same row
    }
    else if (mode === "equipPrev") {
        shopState.equipPage--;
        shopState.mode = "equipList";
    }
    else if (mode === "equipNext") {
        shopState.equipPage++;
        shopState.mode = "equipList";
    }
}

// ---------- Drawing ----------

function drawShopCards() {
    if (shopStock.length === 0) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        text("Sold out! Come back after your next fight.", 400, 400);
        return;
    }

    for (let i = 0; i < shopStock.length; i++) {
        const item = shopStock[i];
        const r = shopCardRect(i);

        noStroke();
        fill(item.sold ? 50 : 70, item.sold ? 35 : 40, item.sold ? 60 : 90);
        rect(r.x, r.y, r.w, r.h, 8);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(20);
        text(item.name, r.x + r.w / 2, r.y + 35);
        textSize(14);
        text(item.type, r.x + r.w / 2, r.y + 65);

        fill(212, 175, 55);
        textSize(18);
        text(item.sold ? "SOLD" : item.price + " gold", r.x + r.w / 2, r.y + 100);
    }
}

// Weapon / Shield choice screen (the buttons are on the right)
function drawEquipChoice() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(26);
    text("What do you want to equip?", 400, 330);

    textSize(20);
    fill(212, 175, 55);
    text("Weapon: " + equippedName("weapon"), 400, 400);
    text("Shield: " + equippedName("shield"), 400, 440);
}

function drawEquipList() {
    const type = shopState.equipType;
    const list = getEquipList(type);
    const pages = equipPageCount(type);

    // clamp in case the list shrank
    if (shopState.equipPage > pages - 1) shopState.equipPage = pages - 1;
    if (shopState.equipPage < 0) shopState.equipPage = 0;

    // header showing what's equipped right now, on a dark strip so it reads over the art
    noStroke();
    fill(0, 0, 0, 150);
    rect(30, 268, 330, 28, 6);
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(18);
    text("Equipped " + type + ": " + equippedName(type), 42, 282);

    if (list.length === 0) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(22);
        text("You don't own any " + type + "s", 400, 400);
    }

    const start = shopState.equipPage * EQUIP_PER_PAGE;
    for (let i = 0; i < EQUIP_PER_PAGE && start + i < list.length; i++) {
        const id = list[start + i];
        const r = equipRowRect(i);
        const isEquipped = PlayerStats.equipment[type] === id;

        noStroke();
        fill(isEquipped ? color(90, 60, 110) : color(70, 40, 90));
        rect(r.x, r.y, r.w, r.h, 8);

        fill(255);
        textAlign(LEFT, CENTER);
        textSize(18);
        text(ITEMS[id].name, r.x + 15, r.y + r.h / 2);
        textSize(14);
        text(bonusText(id), r.x + 260, r.y + r.h / 2);

        if (isEquipped) {
            fill(212, 175, 55);
            textAlign(RIGHT, CENTER);
            textSize(16);
            text("EQUIPPED", r.x + r.w - 15, r.y + r.h / 2);
        }
    }

    if (pages > 1) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text("Page " + (shopState.equipPage + 1) + " / " + pages, 870, 290);
    }
}

function drawShopScreen() {
    // if the shop wasn't drawn last frame, we just entered it, so roll fresh stock
    if (shopStock === null || shopLastFrame !== frameCount - 1) rollShopStock();
    shopLastFrame = frameCount;

    processShopAction();

    // fill the whole canvas first so the strip under the image matches
    background(30, 10, 40);
    image(shopBg, 0, 0, width, 500);

    // cards are hidden on the equip screens
    const inEquipScreens = shopState.mode === "equipChoice" || shopState.mode === "equipList";
    if (!inEquipScreens) {
        drawShopCards();
    }

    if (shopState.mode === "menu") {
        // draw the 3 buttons, then register them in order: Buy, Equip, Leave
        drawShopButton(SHOP_BUTTONS.buy, "BUY", color(50, 160, 70));
        drawShopButton(SHOP_BUTTONS.equip, "EQUIP", color(60, 100, 200));
        drawShopButton(SHOP_BUTTONS.leave, "LEAVE", color(200, 50, 50));

        const b = SHOP_BUTTONS;
        manageScreenButton(b.buy.x, b.buy.y, b.buy.w, b.buy.h,
            shopState, "mode", "menu", "buying");
        manageScreenButton(b.equip.x, b.equip.y, b.equip.w, b.equip.h,
            shopState, "mode", "menu", "equipChoice");
        manageScreenButton(b.leave.x, b.leave.y, b.leave.w, b.leave.h,
            gameState, "screen", "shop", "battle");
    }
    else if (shopState.mode === "buying") {
        // every card is a button, in card order
        for (let i = 0; i < shopStock.length; i++) {
            const r = shopCardRect(i);
            manageScreenButton(r.x, r.y, r.w, r.h,
                shopState, "mode", "buying", "buy:" + i);
        }

        // Back button last, so Up/Down reaches it after the last card
        drawShopButton(SHOP_BUTTONS.back, "BACK", color(120, 120, 130));
        const k = SHOP_BUTTONS.back;
        manageScreenButton(k.x, k.y, k.w, k.h,
            shopState, "mode", "buying", "menu");
    }
    else if (shopState.mode === "equipChoice") {
        drawEquipChoice();

        drawShopButton(SHOP_BUTTONS.weapon, "WEAPON", color(60, 100, 200));
        drawShopButton(SHOP_BUTTONS.shield, "SHIELD", color(60, 100, 200));
        drawShopButton(SHOP_BUTTONS.back, "BACK", color(120, 120, 130));

        const w = SHOP_BUTTONS.weapon;
        const s = SHOP_BUTTONS.shield;
        const k = SHOP_BUTTONS.back;
        manageScreenButton(w.x, w.y, w.w, w.h,
            shopState, "mode", "equipChoice", "pick:weapon");
        manageScreenButton(s.x, s.y, s.w, s.h,
            shopState, "mode", "equipChoice", "pick:shield");
        manageScreenButton(k.x, k.y, k.w, k.h,
            shopState, "mode", "equipChoice", "menu");   // back to Buy / Equip / Leave
    }
    else if (shopState.mode === "equipList") {
        drawEquipList();

        const type = shopState.equipType;
        const list = getEquipList(type);
        const pages = equipPageCount(type);
        const start = shopState.equipPage * EQUIP_PER_PAGE;

        // rows on this page, in order
        for (let i = 0; i < EQUIP_PER_PAGE && start + i < list.length; i++) {
            const r = equipRowRect(i);
            manageScreenButton(r.x, r.y, r.w, r.h,
                shopState, "mode", "equipList", "equip:" + i);
        }

        // Prev / Next only when there is more than one page
        if (pages > 1) {
            drawShopButton(SHOP_BUTTONS.prev, "PREV", color(60, 100, 200));
            drawShopButton(SHOP_BUTTONS.next, "NEXT", color(60, 100, 200));
            const p = SHOP_BUTTONS.prev;
            const n = SHOP_BUTTONS.next;
            manageScreenButton(p.x, p.y, p.w, p.h,
                shopState, "mode", "equipList", "equipPrev");
            manageScreenButton(n.x, n.y, n.w, n.h,
                shopState, "mode", "equipList", "equipNext");
        }

        // Back last, so Down reaches it after everything else
        drawShopButton(SHOP_BUTTONS.back, "BACK", color(120, 120, 130));
        const k = SHOP_BUTTONS.back;
        manageScreenButton(k.x, k.y, k.w, k.h,
            shopState, "mode", "equipList", "equipChoice");   // back to Weapon / Shield
    }

    // temporary message
    if (millis() < shopMessageUntil) {
        noStroke();
        fill(255, 90, 90);
        textAlign(CENTER, CENTER);
        textSize(24);
        text(shopMessage, 500, 282);
    }
}

function drawShopButton(r, label, c) {
    noStroke();
    fill(c);
    rect(r.x, r.y, r.w, r.h, 8);

    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(label, r.x + r.w / 2, r.y + r.h / 2);
}