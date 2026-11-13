function drawTitleScreen() {
    image(titleBg, 0, 0, width, height);
    image(title, 250, -50, 300, 400);

    //Start Button
    image(startButton, 300, 220, 200, 140);

    // Start Button functionality
    manageScreenButton(
        300, 220, 200, 50,
        gameState,
        "screen",
        "title",
        "battle"
    );

    // OPTIONS BUTTON
    image(optionsButton, 305, 260, 200, 140);

    // Options button functionality
    manageScreenButton(
        310, 305, 200, 40,
        gameState,
        "screen",
        "title",
        "options"
    );

    push();
    fill(40);
    rect(300, 400, 200, 50);

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
