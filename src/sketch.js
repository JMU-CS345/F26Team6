let fireMage;

let gameState = {
  currentScreen: "battle"
};

function preload() {
  fireMage = loadImage("assets/firemage_default.png");
}

function setup() {
  createCanvas(1000, 600);
}

function draw() {

  if (gameState.currentScreen === "title") {
    drawTitleScreen();
  }

  if (gameState.currentScreen === "battle") {
    drawBattleScreen();
  }
}

function drawTitleScreen() {
  background(50);

  fill(255);
  textSize(32);
  text("Title Screen", 100, 100);
}

function drawBattleScreen() {

  background(90, 140, 90);

  // Player
  image(fireMage, 120, 180, 120, 120);

  // Enemies
  fill(255, 0, 0);
  rect(700, 200, 80, 80);
  rect(700, 320, 80, 80);

  text("Enemy 1", 700, 300);
  text("Enemy 2", 700, 420);

  // Attack Menu
  fill(40);
  rect(50, 400, 250, 150);

  fill(255);
  textSize(20);
  text("> Attack", 75, 440);
  text("> Magic", 75, 480);
  text("> Item", 75, 520);
}