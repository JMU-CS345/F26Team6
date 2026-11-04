function drawTitleScreen() {

    background(25, 30, 45);

    // OPTIONS BUTTON
    fill(70, 100, 180);
    rect(300, 320, 200, 50, 10);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("OPTIONS", 400, 345);

    // Options button functionality
    manageScreenButton(
        300, 320, 200, 50,
        gameState,
        "screen",
        "title",
        "options"
    );

}
