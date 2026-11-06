function manageScreenButton(x, y, w, h, stateObj, stateProperty, activeScreen, targetScreen) {
  // Initialize a universal global safety click timer if it doesn't exist yet
  if (window._btnClickTimer === undefined) window._btnClickTimer = 0;

  // 1. Only run if we are currently on the correct active screen
  if (stateObj[stateProperty] === activeScreen) {
    
    // 2. Check mouse positioning, physical mouse press, and safety cooldown
    if (mouseIsPressed && millis() - window._btnClickTimer > 250 &&
        mouseX >= x && mouseX <= x + w && 
        mouseY >= y && mouseY <= y + h) {
      
      stateObj[stateProperty] = targetScreen; // Dynamically update the state variable
      window._btnClickTimer = millis();        // Reset safety click cooldown
    }
  }
}