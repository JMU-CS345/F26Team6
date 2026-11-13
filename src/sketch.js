let fireMage;
let startButton;
let optionsButton;
let titleBg;
let title;
let rng;
let currentFight = null;
let battleEnemies = [];
let playerGold = 0;
let enemyImages = {};
let ratEnemy;
let smallSlimeEnemy;
let mediumSlimeEnemy;
let iceCubeEnemy;
let beeSwarmEnemy;
let skeletonEnemy;
let pigEnemy;
let blockSlimeEnemy;

let gameState = {
    screen: "title",
    battleMenu: "main",
    optionsMenu: "main"

};

function preload() {
    fireMage = loadImage("assets/firemage_default.png");
    ratEnemy = loadImage("assets/rat_enemy.png");
    smallSlimeEnemy = loadImage("assets/small_slime_enemy.png");
    mediumSlimeEnemy = loadImage("assets/medium_slime_enemy.png");
    iceCubeEnemy = loadImage("assets/ice_cubes_enemy.png");
    beeSwarmEnemy = loadImage("assets/bee_swarm_enemy.png");
    skeletonEnemy = loadImage("assets/skelly_enemy.png");
    pigEnemy = loadImage("assets/pig_enemy.png");
    blockSlimeEnemy = loadImage("assets/block_slime_enemy.png");
    title = loadImage("assets/magequest-title.png");

    startButton = loadImage("assets/start_button.png");
    optionsButton = loadImage("assets/options_button.png");
    titleBg = loadImage("assets/title_bg.png");

    enemyImages = {
        "rat": ratEnemy,
        "slime": smallSlimeEnemy,
        "medium-slime": mediumSlimeEnemy,
        "ice-cube": iceCubeEnemy,
        "bee-swarm": beeSwarmEnemy,
        "skeleton": skeletonEnemy,
        "pig": pigEnemy,
        "block-slime": blockSlimeEnemy,

    };
}

function setup() {
    createCanvas(1000, 600);
    rng = new GameRNG();
}

function startBattle() {
    currentFight = generateFight(rng);
    battleEnemies = [];
    for (let i = 0; i < currentFight.enemies.length; i++) {
        const e = currentFight.enemies[i];
        battleEnemies.push({
            type: e.type,
            size: e.size,
            hp: e.size === "big" ? 100 : 30   // placeholder, use your health system
        });
    }
}

function endBattle() {
    playerGold += rollGold(rng, currentFight);
    currentFight = null;
    battleEnemies = [];
}

function draw() {

    if (gameState.screen === "title") {
        drawTitleScreen();
    }

    else if (gameState.screen === "battle") {
        if (currentFight === null) startBattle();
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
    if (key === "d") damage(player, 10);
    if (key === "h") heal(player, 10);
    if (key === "e") damage(enemy, 10);
}