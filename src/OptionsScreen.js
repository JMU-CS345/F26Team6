function drawOptionsScreen() {

    // Set background colour
    background(35, 35, 50);

    // OPTIONS TITLE
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("OPTIONS", 400, 150);

    // BACK BUTTON
    fill(180, 70, 70);
    rect(300, 400, 200, 50, 10);

    // BACK BUTTON TEXT
    fill(255);
    textSize(20);
    text("BACK", 400, 425);

    // BACK BUTTON FUNCTIONALITY
    manageScreenButton(
        300, 400, 200, 50,
        gameState,
        "screen",
        "options",
        "title"
    );

}
