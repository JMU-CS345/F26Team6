let fireMage;
let startButton;
let optionsButton;
let battleSubmenuCursor;
let shopBg;
let titleBg;
let title;
let rng;
let currentFight = null;
let battleEnemies = [];
let lastBattleReward = 0;
let enemyTargetCursor;
let enemyImages = {};
let ratEnemy;
let smallSlimeEnemy;
let mediumSlimeEnemy;
let iceCubeEnemy;
let beeSwarmEnemy;
let skeletonEnemy;
let pigEnemy;
let blockSlimeEnemy;


const BATTLES_PER_SHOP = 6;

let gameState = {
    screen: "title",
    battleMenu: "main",
    optionsMenu: "main",
    battlesWon: 0
};

function preload() {
    fireMage = loadImage("assets/firemage_default.png");
    shopBg = loadImage("assets_NEW/Hooded Shopkeeper in a Lantern-Lit Stall.png");
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
    battleSubmenuCursor = loadImage("assets/battle_submenu_cursor.png");
    enemyTargetCursor = loadImage("assets/enemy_target_cursor.png");
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
    loadItemImages();

    Gold.add(100); //however much starting gold
}

function startBattle() {
    currentFight = generateFight(rng);
    battleEnemies = createEnemiesForFight(currentFight);
    gameState.battleMenu = "main";
    startBattleRounds(battleEnemies, rng);
}

function endBattle() {
    lastBattleReward = awardFightGold(rng, currentFight);
    currentFight = null;
    battleEnemies = [];

    gameState.battlesWon++;
    gameState.screen = "victory";
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

    else if (gameState.screen === "victory") {
        drawVictoryScreen();
    }

    else if (gameState.screen === "shop") {
        drawShopScreen();
    }

    drawGoldCounter(); //puts gold on screen
}

