// ---------- MANA DATA ----------
// Only the player has mana. Enemies don't.
let playerMana = { mp: 50, maxMp: 50 };

// ---------- MANA FUNCTIONS ----------
function hasMana(cost) {
    return playerMana.mp >= cost;
}

// Spends mana if there's enough. Returns true if it worked, false if not.
function spendMana(cost) {
    if (!hasMana(cost)) return false;
    playerMana.mp -= cost;
    return true;
}

function restoreMana(amount) {
    playerMana.mp = min(playerMana.maxMp, playerMana.mp + amount);   // can't go above max
}

// call this when a battle starts
function resetBattleMana() {
    playerMana.mp = playerMana.maxMp;
}

// ---------- MANA BAR ----------
function drawManaBar(x, y, w, h) {
    push();

    // empty bar (the dark background)
    fill(60);
    rect(x, y, w, h);

    // filled part, sized by how much mana is left
    const ratio = playerMana.mp / playerMana.maxMp;
    fill(60, 120, 230);   // blue
    rect(x, y, w * ratio, h);

    // "mp / maxMp" label
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(14);
    text(playerMana.mp + " / " + playerMana.maxMp, x + 6, y + h / 2);

    pop();
}