















let bgImage;
let titleImage;
let startImage;
let optionsImage;
let currentScreen = "menu";
let difficulty = "Medium";

async function setup() {
  createCanvas(400, 400);

  bgImage = await loadImage('title_bg.png');
  titleImage = await loadImage('magequest-title.png');
  startImage = await loadImage('start_button.png');
  optionsImage = await loadImage('options_button.png');

  console.log("Background:", bgImage.width, bgImage.height);
  console.log("Title:", titleImage.width, titleImage.height);
  console.log("Start:", startImage.width, startImage.height);
  console.log("Options:", optionsImage.width, optionsImage.height);

  describe("MageQuest title screen with background image.");
}

function draw() {
  background(220);

  imageMode(CORNER);
  image(bgImage, 0, 0, width, height);

  if (currentScreen == "menu") {
    imageMode(CENTER);
    image(titleImage, width / 2, 85, 250, 180);
    image(startImage, width / 2, 220, 150, 75);
    image(optionsImage, width / 2, 290, 150, 75);

    textAlign(CENTER);
    textSize(20);
    fill(255);
    text("DIFFICULTY", width / 2, 375);
  }

  else if (currentScreen == "difficulty") {
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
  }
}

function mousePressed() {

  if (currentScreen == "menu") {
    if (mouseX > 125 && mouseX < 275 &&
        mouseY > 350 && mouseY < 395) {

      currentScreen = "difficulty";
    }
  }

  else if (currentScreen == "difficulty") {

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

    if (mouseX > 150 && mouseX < 250 &&
        mouseY > 345 && mouseY < 390) {

      currentScreen = "menu";
    }
  }
}
