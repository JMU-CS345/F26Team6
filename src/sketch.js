let fireMage;
let startButton;
let optionsButton;
let titleBg;

let gameState = {
    screen: "title",
    battleMenu: "main",
    optionsMenu: "main"
};

function preload() {
    fireMage = loadImage("assets/firemage_default.png");
    ratEnemy = loadImage("assets/rat_enemy.png");
    slimeEnemy = loadImage("assets/small_slime_enemy.png");

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
}