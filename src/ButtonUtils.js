function manageScreenButton(x, y, w, h, stateObj, stateProperty, activeScreen, targetScreen) {
  if (window._btnClickTimer === undefined) window._btnClickTimer = 0;

  if (stateObj[stateProperty] === activeScreen) {
    if (mouseIsPressed && millis() - window._btnClickTimer > 250 &&
        mouseX >= x && mouseX <= x + w &&
        mouseY >= y && mouseY <= y + h) {

      stateObj[stateProperty] = targetScreen;
      window._btnClickTimer = millis();
    }
  }
}

let bgImage;
let titleImage;
let startImage;
let optionsImage;
let gameState = { currentScreen: "menu" };
let difficulty = "Medium";

async function setup() {
  createCanvas(400, 400);

  bgImage = await loadImage('title_bg.png');
  titleImage = await loadImage('magequest-title.png');
  startImage = await loadImage('start_button.png');
  optionsImage = await loadImage('options_button.png');

  describe("MageQuest title screen with background image.");
}

function draw() {
  background(220);

  imageMode(CORNER);
  image(bgImage, 0, 0, width, height);

  if (gameState.currentScreen == "menu") {
    imageMode(CENTER);
    image(titleImage, width / 2, 85, 250, 180);
    image(startImage, width / 2, 220, 150, 75);
    image(optionsImage, width / 2, 290, 150, 75);

    textAlign(CENTER);
    textSize(20);
    fill(255);
    text("DIFFICULTY", width / 2, 375);

    manageScreenButton(125, 350, 150, 45, gameState,
      "currentScreen", "menu", "difficulty");
  }

  else if (gameState.currentScreen == "difficulty") {
    textAlign(CENTER);
    fill(255);

    textSize(30);
    text("DIFFICULTY", width / 2, 100);

    textSize(22);

    if (difficulty == "Easy") {
      fill("yellow");
    } else {
      fill(255);
    }
    text("EASY", width / 2, 190);

    if (difficulty == "Medium") {
      fill("yellow");
    } else {
      fill(255);
    }
    text("MEDIUM", width / 2, 240);

    if (difficulty == "Hard") {
      fill("yellow");
    } else {
      fill(255);
    }
    text("HARD", width / 2, 290);

    fill(255);
    textSize(16);
    text("Selected: " + difficulty, width / 2, 330);

    fill(255);
    text("BACK", width / 2, 370);

    manageScreenButton(150, 345, 100, 45, gameState,
      "currentScreen", "difficulty", "menu");
  }
}

function mousePressed() {
  if (gameState.currentScreen == "difficulty") {

    if (mouseX > 150 && mouseX < 250 &&
        mouseY > 170 && mouseY < 205) {
      difficulty = "Easy";
    }

    if (mouseX > 150 && mouseX < 250 &&
        mouseY > 220 && mouseY < 255) {
      difficulty = "Medium";
    }

    if (mouseX > 150 && mouseX < 250 &&
        mouseY > 270 && mouseY < 305) {
      difficulty = "Hard";
    }
  }
}
