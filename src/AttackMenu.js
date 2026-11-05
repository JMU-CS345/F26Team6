const attackMenuOptions = ["Attack", "Magic", "Item"];

function drawAttackMenu() {
    // one big box
    fill(40);
    rect(50, 400, 250, 150);

    // the three options, stacked inside it
    fill(255);
    for (let i = 0; i < attackMenuOptions.length; i++) {
        text("> " + attackMenuOptions[i], 75, 440 + i * 40);
    }

    // one clickable row per option, all inside the box
    for (let i = 0; i < attackMenuOptions.length; i++) {
        manageScreenButton(50, 420 + i * 40, 250, 40,
            gameState, "screen", "battle",
            attackMenuOptions[i].toLowerCase());
    }
}