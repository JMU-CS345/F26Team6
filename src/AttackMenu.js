const attackMenuOptions = ["Attack", "Magic", "Block", "Item"];

function drawAttackMenu() {
    // Block is instant: run it once, then go straight back to the main menu
    if (gameState.battleMenu === "block") {
        playerBlock();                  // your block logic goes here
        gameState.battleMenu = "main";
    }

    if (gameState.battleMenu.startsWith("use:")) {
        const attack = getBasicAttack(gameState.battleMenu.substring(4));
        if (attack !== null) useBasicAttack(attack, getTargetEnemy());
        gameState.battleMenu = "main";
    }

    // the one big box, always drawn
    fill(40);
    rect(50, 400, 250, 150);
    fill(255);

    const top = 405;   // first row starts just inside the box
    const rowH = 36;   // 4 rows x 36 = 144, fits in the 150px box

    if (gameState.battleMenu === "main") {
        // the 4 options
        for (let i = 0; i < attackMenuOptions.length; i++) {
            text("> " + attackMenuOptions[i], 75, top + i * rowH + 22);
            manageScreenButton(50, top + i * rowH, 150, rowH,
                gameState, "battleMenu", "main",
                attackMenuOptions[i].toLowerCase());
        }
    } else if (gameState.battleMenu === "attack") {
        // the 4 basic attacks
        for (let i = 0; i < basicAttacks.length; i++) {
            const name = basicAttacks[i].name;
            text("> " + name, 75, top + i * rowH + 22);
            manageScreenButton(50, top + i * rowH, 150, rowH,
                gameState, "battleMenu", "attack",
                "use:" + name);
        }
        text("< Back", 225, 530);
        manageScreenButton(210, 510, 80, 30,
            gameState, "battleMenu", "attack", "main");
    }
    else {
        // blank box: put the sub-menu content here later
        text("< Back", 225, 530);
        for (let i = 0; i < attackMenuOptions.length; i++) {
            manageScreenButton(210, 510, 80, 30,
                gameState, "battleMenu", attackMenuOptions[i].toLowerCase(),
                "main");
        }
    }
}

function playerBlock() {
    // e.g. mark the player as blocking for the enemy's next attack,
    // then end the player's turn
}