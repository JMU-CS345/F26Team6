function drawTitleScreen() {
    image(titleBg, 0, 0, width, height);
    image(title, 250, -50, 300, 400);

    //Start Button
    image(startButton, 300, 240, 200, 120);

    // Start Button functionality
    manageScreenButton(
        300, 240, 200, 50,
        gameState,
        "screen",
        "title",
        "battle"
    );

    // OPTIONS BUTTON
    image(optionsButton, 310, 320, 180, 120);

    // Options button functionality
    manageScreenButton(
        300, 320, 200, 50,
        gameState,
        "screen",
        "title",
        "options"
    );

    push();
    fill(40);
    rect(300, 400, 200, 50);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("DIFFICULTY", 400, 425);
    pop();

    // Difficulty button functionality (new)
    manageScreenButton(
        300, 400, 200, 50,
        gameState,
        "screen",
        "title",
        "difficulty"
    );

}
