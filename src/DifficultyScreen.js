let difficulty = "Medium";
const difficultyLevels = ["Easy", "Medium", "Hard"];

function drawDifficultyScreen() {
    push();   // keeps textAlign/textSize from leaking into other screens

    background(35, 35, 50);
    textAlign(CENTER, CENTER);

    fill(255);
    textSize(36);
    text("DIFFICULTY", 500, 150);

    // the three choices, the selected one in yellow
    textSize(24);
    for (let i = 0; i < difficultyLevels.length; i++) {
        const y = 230 + i * 60;
        fill(difficultyLevels[i] === difficulty ? "yellow" : 255);
        text(difficultyLevels[i].toUpperCase(), 500, y);
    }

    fill(255);
    textSize(18);
    text("Selected: " + difficulty, 500, 420);

    // BACK BUTTON
    fill(180, 70, 70);
    rect(400, 460, 200, 50, 10);
    fill(255);
    textSize(20);
    text("BACK", 500, 485);

    manageScreenButton(400, 460, 200, 50,
        gameState, "screen", "difficulty", "title");

    pop();
}

// picks the difficulty when one of the three choices is clicked
function mousePressed() {
    if (gameState.screen !== "difficulty") return;

    for (let i = 0; i < difficultyLevels.length; i++) {
        const y = 230 + i * 60;
        if (mouseX > 400 && mouseX < 600 && mouseY > y - 20 && mouseY < y + 20) {
            difficulty = difficultyLevels[i];
        }
    }
}