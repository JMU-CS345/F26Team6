// Keyboard navigation state (shared by all buttons)
window._btnClickTimer = window._btnClickTimer ?? 0;
window._btnList = [];        // buttons registered this frame
window._btnPrev = [];        // buttons registered last frame (what the keys navigate)
window._btnFrame = -1;
window._btnIndex = 0;
window._btnKeyboardActive = false;

// Listen for keys once, without touching your own keyPressed()
if (!window._btnKeysAttached) {
  window._btnKeysAttached = true;

  window.addEventListener('keydown', function (e) {
    const list = window._btnPrev;
    if (list.length === 0) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); // stop the page from scrolling

      if (!window._btnKeyboardActive) {
        // First arrow press just shows the selector on the first button
        window._btnKeyboardActive = true;
        window._btnIndex = 0;
      } else if (e.key === 'ArrowDown') {
        window._btnIndex = (window._btnIndex + 1) % list.length;
      } else {
        window._btnIndex = (window._btnIndex - 1 + list.length) % list.length;
      }
    }

    // Enter or Space activates the selected button
    if (window._btnKeyboardActive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const b = list[window._btnIndex];
      if (b) {
        b.stateObj[b.stateProperty] = b.targetScreen;
        window._btnIndex = 0;
        window._btnClickTimer = millis();
      }
    }
  });
}

function manageScreenButton(x, y, w, h, stateObj, stateProperty, activeScreen, targetScreen) {
  if (window._btnClickTimer === undefined) window._btnClickTimer = 0;

  // 1. Only run if we are currently on the correct active screen
  if (stateObj[stateProperty] === activeScreen) {

    // New frame? Last frame's buttons become the navigable list.
    if (window._btnFrame !== frameCount) {
      window._btnPrev = window._btnList;
      window._btnList = [];
      window._btnFrame = frameCount;
      if (window._btnIndex >= window._btnPrev.length) window._btnIndex = 0;
    }

    // Register this button and remember its position in the order
    const myIndex = window._btnList.length;
    window._btnList.push({ stateObj, stateProperty, targetScreen });

    // 2. Draw the red placeholder box to the left of the selected button
    if (window._btnKeyboardActive && myIndex === window._btnIndex) {
      push();
      noStroke();
      fill(255, 0, 0);
      rect(x - 24, y + h / 2 - 8, 16, 16); // swap this for your sprite later
      pop();
    }

    // 3. Mouse click (same as before)
    if (mouseIsPressed && millis() - window._btnClickTimer > 250 &&
      mouseX >= x && mouseX <= x + w &&
      mouseY >= y && mouseY <= y + h) {

      stateObj[stateProperty] = targetScreen;
      window._btnClickTimer = millis();
      window._btnKeyboardActive = false; // hide selector once the mouse is used
      window._btnIndex = 0;
    }
  }
}