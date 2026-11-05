function drawOptionsScreen() {
    push();   // stops textAlign/textSize leaking into other screens

    // Set background colour
    background(35, 35, 50);

    // OPTIONS TITLE
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("OPTIONS", 400, 150);

    // VISUAL / AUDIO MENU
    textSize(20);
    const optionsMenuOptions = ["Visual", "Audio"];

    if (gameState.optionsMenu === "main") {
        // the two buttons
        for (let i = 0; i < optionsMenuOptions.length; i++) {
            const y = 200 + i * 90;

            fill(40);
            rect(400, y, 200, 60);
            fill(255);
            text(optionsMenuOptions[i], 500, y + 30);

            manageScreenButton(400, y, 200, 60,
                gameState, "optionsMenu", "main",
                optionsMenuOptions[i].toLowerCase());
        }

        // BACK BUTTON (only on the main options page)
        fill(180, 70, 70);
        rect(300, 400, 200, 50, 10);

        fill(255);
        text("BACK", 400, 425);

        manageScreenButton(
            300, 400, 200, 50,
            gameState,
            "screen",
            "options",
            "title"
        );
    } else {
        // the new box: put the visual / audio settings here later
        fill(40);
        rect(250, 190, 500, 260);

        fill(255);
        text("< Back", 320, 420);

        for (let i = 0; i < optionsMenuOptions.length; i++) {
            manageScreenButton(270, 400, 100, 40,
                gameState, "optionsMenu", optionsMenuOptions[i].toLowerCase(),
                "main");
        }
    }

    pop();
}