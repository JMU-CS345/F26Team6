function drawKeyboardHighlight(x, y, w, h) {

    push();

    stroke(255, 255, 0);
    strokeWeight(4);
    noFill();

    rect(
        x - 5,
        y - 5,
        w + 10,
        h + 10
    );

    pop();
}

function navigateMenu(selectedIndex, maxIndex) {

    if (keyCode === UP_ARROW) {
        selectedIndex--;
    }

    if (keyCode === DOWN_ARROW) {
        selectedIndex++;
    }

    return constrain(
        selectedIndex,
        0,
        maxIndex
    );
}