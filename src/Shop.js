// Shop.js

const SHOP_ITEM_COUNT = 6;
const SHOP_COLUMNS = 3;

// Placeholder item pool, replace with your real items later
const SHOP_ITEM_POOL = [
    { name: "Iron Staff", price: 50, type: "weapon" },
    { name: "Oak Staff", price: 35, type: "weapon" },
    { name: "Mage Robe", price: 60, type: "armor" },
    { name: "Leather Boots", price: 40, type: "armor" },
    { name: "Ruby Ring", price: 75, type: "accessory" },
    { name: "Sapphire Ring", price: 75, type: "accessory" },
    { name: "Health Potion", price: 20, type: "item" },
    { name: "Mana Potion", price: 20, type: "item" },
    { name: "Lucky Charm", price: 90, type: "accessory" },
    { name: "Wizard Hat", price: 55, type: "armor" }
];

let shopStock = null;                 // null means "needs to be rolled"
let shopState = { mode: "menu" };     // "menu", "buying", or a one-frame action like "buy:2"
let shopMessage = "";
let shopMessageUntil = 0;             // millis() time when the message disappears

// One place to change if your GameRNG uses a different method
function shopRandInt(max) {
    return Math.floor(random(max)); // TODO: swap for your seeded rng
}

function rollShopStock() {
    // copy the pool so we don't shuffle the original
    const pool = [];
    for (let i = 0; i < SHOP_ITEM_POOL.length; i++) {
        pool.push({ ...SHOP_ITEM_POOL[i], sold: false, equipped: false });
    }

    // partial Fisher-Yates shuffle, picks SHOP_ITEM_COUNT unique items
    for (let i = 0; i < SHOP_ITEM_COUNT; i++) {
        const j = i + shopRandInt(pool.length - i);
        const temp = pool[i];
        pool[i] = pool[j];
        pool[j] = temp;
    }

    shopStock = pool.slice(0, SHOP_ITEM_COUNT);
    shopState.mode = "menu";
    shopMessage = "";
}

function showShopMessage(msg) {
    shopMessage = msg;
    shopMessageUntil = millis() + 1500;
}

// Item cards: 3x2 grid in the blank area, left of the buttons
function shopCardRect(i) {
    const col = i % SHOP_COLUMNS;
    const row = Math.floor(i / SHOP_COLUMNS);
    return { x: 40 + col * 235, y: 300 + row * 145, w: 220, h: 130 };
}

// Buttons: right side, stacked, in the order Buy, Equip, Leave
const SHOP_BUTTONS = {
    buy: { x: 780, y: 310, w: 180, h: 50 },
    equip: { x: 780, y: 380, w: 180, h: 50 },
    leave: { x: 780, y: 450, w: 180, h: 50 },
    back: { x: 780, y: 450, w: 180, h: 50 }   // same spot as Leave, only shown while buying
};

// Handles whatever the buttons set shopState.mode to
function processShopAction() {
    const mode = shopState.mode;

    if (mode.startsWith("buy:")) {
        const i = parseInt(mode.split(":")[1]);
        const item = shopStock[i];

        if (item.sold) {
            showShopMessage("Already sold!");
            shopState.mode = "buying";   // stay so they can pick another item
            window._btnIndex = i;        // keep the cursor on the same card
        } else if (Gold.subtract(item.price)) {   // swap for Gold.spend() if you have one
            item.sold = true;
            showShopMessage("Purchased " + item.name + "!");
            shopState.mode = "menu";
        } else {
            showShopMessage("Not enough gold!");
            shopState.mode = "menu";
        }
    }
    else if (mode === "equip") {
        showShopMessage("Equipping coming soon!"); // TODO: equip flow
        shopState.mode = "menu";
    }
}

function drawShopScreen() {
    if (shopStock === null) rollShopStock();

    processShopAction();

    // fill the whole canvas first so the strip under the image matches
    background(30, 10, 40);
    image(shopBg, 0, 0, width, 500);

    // item cards (drawing only, buttons are registered below)
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

    if (shopState.mode === "menu") {
        // draw the 3 buttons, then register them in order: Buy, Equip, Leave
        drawShopButton(SHOP_BUTTONS.buy, "BUY", color(50, 160, 70));
        drawShopButton(SHOP_BUTTONS.equip, "EQUIP", color(60, 100, 200));
        drawShopButton(SHOP_BUTTONS.leave, "LEAVE", color(200, 50, 50));

        const b = SHOP_BUTTONS;
        manageScreenButton(b.buy.x, b.buy.y, b.buy.w, b.buy.h,
            shopState, "mode", "menu", "buying");
        manageScreenButton(b.equip.x, b.equip.y, b.equip.w, b.equip.h,
            shopState, "mode", "menu", "equip");
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

        // Back button last, so Up/Down reaches it after the 6th card
        drawShopButton(SHOP_BUTTONS.back, "BACK", color(120, 120, 130));
        const k = SHOP_BUTTONS.back;
        manageScreenButton(k.x, k.y, k.w, k.h,
            shopState, "mode", "buying", "menu");
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