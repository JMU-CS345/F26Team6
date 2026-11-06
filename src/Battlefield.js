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