// Battle screen entry point.
// Called when gameState.screen === "battle"
function drawBattleScreen() {

    background(200, 140, 90);

    textSize(18);
    textAlign(LEFT, TOP);

    image(fireMage, 120, 180, 120, 120);
    drawEnemies();

    drawAttackMenu();
    drawHealthBar(50, 330, 250, 20, player);
    drawManaBar(50, 310, 250, 20);
    drawEnemyHealthBars();
}

function drawEnemies() {
    for (let i = 0; i < battleEnemies.length; i++) {
        const e = battleEnemies[i];
        if (isDead(e)) continue;                 // dead enemies disappear

        const img = enemyImages[e.type];
        const size = e.size === "big" ? 160 : 90;
        const x = 450 + i * 130;

        if (img) {
            image(img, x, 200, size, size);
        } else {
            fill(200, 50, 50);                   // placeholder box for enemies without art yet
            rect(x, 200, size, size);
        }
                // arrow above the currently targeted enemy
        if (i === targetIndex) {
            image(enemyTargetCursor, x + size / 2 - 14, 160, 28, 36);
        }
    }
}

// One health bar per enemy, stacked top to bottom in spawn order
function drawEnemyHealthBars() {
    const barX = 615;
    const barY = 370;
    const barW = 300;
    const barH = 20;
    const spacing = 26;                          // bar height + a 6px gap

    getTargetEnemy();                            // keeps targetIndex pointing at a living enemy

    for (let i = 0; i < battleEnemies.length; i++) {
        const y = barY + i * spacing;
        drawHealthBar(barX, y, barW, barH, battleEnemies[i]);

        // small marker showing which enemy is currently targeted
        if (i === targetIndex) {
            push();
            fill(255);
            textAlign(RIGHT, CENTER);
            text(">", barX - 6, y + barH / 2);
            pop();
        }
    }
}