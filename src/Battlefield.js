// Battle screen entry point.
// Called when gameState.screen === "battle"
function drawBattleScreen() {

    background(200, 140, 90);

    textSize(18);
    textAlign(LEFT, TOP);

    image(fireMage, 120, 180, 120, 120);

    image(ratEnemy, 700, 200, 80, 80);
    image(slimeEnemy, 700, 320, 80, 80);

    drawAttackMenu();
    drawHealthBar(50, 330, 250, 20, player);
    drawManaBar(50, 310, 250, 20,);
    drawHealthBar(615, 370, 300, 20, enemy);


}

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
    drawManaBar(50, 310, 250, 20,);
    drawHealthBar(615, 370, 300, 20, enemy);

    function drawEnemies() {
        for (let i = 0; i < battleEnemies.length; i++) {
            const e = battleEnemies[i];
            const img = enemyImages[e.type];
            const size = e.size === "big" ? 160 : 90;
            const x = 450 + i * 130;

            if (img) {
                image(img, x, 200, size, size);
            } else {
                fill(200, 50, 50);       // placeholder box for enemies without art yet
                rect(x, 200, size, size);
            }
        }
    }
}