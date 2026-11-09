function drawTitleScreen() {
    image(titleBg, 0, 0, width, height);

    //Start Button
    image(startButton, 300, 240, 200, 50);

    // Start Button functionality
    manageScreenButton(
        300, 240, 200, 50,
        gameState,
        "screen",
        "title",
        "battle"
    );

    // OPTIONS BUTTON
    image(optionsButton, 300, 320, 200, 50);

    // Options button functionality
    manageScreenButton(
        300, 320, 200, 50,
        gameState,
        "screen",
        "title",
        "options"
    );

}
