let fireMage;
let startButton;
let optionsButton;
let titleBg;
let title;

let gameState = {
    screen: "title",
    battleMenu: "main",
    optionsMenu: "main",

    selectedTitle: 0
};

function preload() {

    fireMage = loadImage("assets/firemage_default.png");

    ratEnemy = loadImage("assets/rat_enemy.png");
    slimeEnemy = loadImage("assets/small_slime_enemy.png");

    title = loadImage("assets/magequest-title.png");

    startButton = loadImage("assets/start_button.png");
    optionsButton = loadImage("assets/options_button.png");

    titleBg = loadImage("assets/title_bg.png");
}

function setup() {
    createCanvas(1000, 600);
}

function draw() {

    if (gameState.screen === "title") {
        drawTitleScreen();
    }

    else if (gameState.screen === "battle") {
        drawBattleScreen();
    }

    else if (gameState.screen === "options") {
        drawOptionsScreen();
    }

    else if (gameState.screen === "difficulty") {
        drawDifficultyScreen();
    }
}

function keyPressed() {

    if (gameState.screen === "title") {

        gameState.selectedTitle =
            navigateMenu(
                gameState.selectedTitle,
                2
            );

        if (keyCode === ENTER) {

            switch (gameState.selectedTitle) {

                case 0:
                    gameState.screen = "battle";
                    break;

                case 1:
                    gameState.screen = "options";
                    break;

                case 2:
                    gameState.screen = "difficulty";
                    break;
            }
        }
    }

    if (key === "d") damage(player, 10);
    if (key === "h") heal(player, 10);
    if (key === "e") damage(enemy, 10);
}