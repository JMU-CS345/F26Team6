// Draw the UI here to keep sketch clean.

//
function drawGoldCounter() {
    push();

    fill(0, 180);
    noStroke();
    rect(width - 170, 10, 160, 40, 8);

    fill(212, 175, 55);
    textAlign(RIGHT, CENTER);
    textSize(24);
    text("Gold: " + Gold.get(), width - 20, 30);

    pop();
}

function drawVictoryScreen() {
    background(30, 120, 50);

    fill(255);
    textAlign(CENTER, CENTER);

    textSize(40);
    text("Victory!", width / 2, 180);

    textSize(24);
    text(
        "You won the battle and earned " +
        lastBattleReward +
        " gold!",
        width / 2,
        250
    );

    // Go to the shop after every 6th battle, otherwise straight to the next fight
    const goingToShop = (gameState.battlesWon % BATTLES_PER_SHOP === 0);
    const nextScreen = goingToShop ? "shop" : "battle";

    // Draw the button
    fill(200);
    rect(width / 2 - 100, 320, 200, 60, 8);

    fill(0);
    textSize(28);
    text(goingToShop ? "Visit Shop" : "Next Battle", width / 2, 350);

    manageScreenButton(
        width / 2 - 100,
        320,
        200,
        60,
        gameState,
        "screen",
        "victory",
        nextScreen
    );
}