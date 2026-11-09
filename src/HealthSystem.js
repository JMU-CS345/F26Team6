// ---------- HEALTH DATA ----------
let player = { hp: 100, maxHp: 100 };
let enemy = { hp: 50, maxHp: 50 };

// ---------- HEALTH FUNCTIONS ----------
function damage(target, amount) {
    target.hp = max(0, target.hp - amount);                // can't go below 0
}

function heal(target, amount) {
    target.hp = min(target.maxHp, target.hp + amount);     // can't go above max
}

function isDead(target) {
    return target.hp <= 0;
}

// call this when a battle starts
function resetBattleHealth() {
    player.hp = player.maxHp;
    enemy.hp = enemy.maxHp;
}

// ---------- HEALTH BAR ----------
function drawHealthBar(x, y, w, h, target) {
    push();

    // empty bar (the dark background)
    fill(60);
    rect(x, y, w, h);

    // filled part, sized by how much health is left
    const ratio = target.hp / target.maxHp;

    if (ratio > 0.5) fill(80, 200, 80);          // green
    else if (ratio > 0.25) fill(230, 200, 50);   // yellow
    else fill(210, 60, 60);                      // red

    rect(x, y, w * ratio, h);

    // "hp / maxHp" label
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(14);
    text(target.hp + " / " + target.maxHp, x + 6, y + h / 2);

    pop();
}