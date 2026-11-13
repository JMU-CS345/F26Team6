function drawTitleScreen() {

    image(titleBg, 0, 0, width, height);
    image(title, 250, -50, 300, 400);

    // START BUTTON

    if (gameState.selectedTitle === 0) {

        drawKeyboardHighlight(
            300,
            220,
            200,
            140
        );
    }

    image(startButton, 300, 220, 200, 140);

    manageScreenButton(
        300,
        220,
        200,
        140,
        gameState,
        "screen",
        "title",
        "battle"
    );



    // OPTIONS BUTTON

    if (gameState.selectedTitle === 1) {

        drawKeyboardHighlight(
            305,
            260,
            200,
            140
        );
    }

    image(optionsButton, 305, 260, 200, 140);

    manageScreenButton(
        305,
        260,
        200,
        140,
        gameState,
        "screen",
        "title",
        "options"
    );



    // DIFFICULTY BUTTON

    if (gameState.selectedTitle === 2) {

        drawKeyboardHighlight(
            300,
            400,
            200,
            50
        );
    }

    push();

    fill(40);
    rect(300, 400, 200, 50);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("DIFFICULTY", 400, 425);

    pop();

    manageScreenButton(
        300,
        400,
        200,
        50,
        gameState,
        "screen",
        "title",
        "difficulty"
    );
}