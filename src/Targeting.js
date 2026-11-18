// Targeting.js
// Keyboard enemy selection (arrow keys).
// Uses targetIndex, getTargetEnemy() and isDead() from HealthSystem.js
// and battleEnemies / gameState from sketch.js.

// direction: +1 = next living enemy, -1 = previous living enemy (wraps around)
function cycleTarget(direction) {
    getTargetEnemy();   // make sure targetIndex points at a living enemy

    const n = battleEnemies.length;
    if (n === 0) return;

    for (let step = 1; step <= n; step++) {
        const idx = (((targetIndex + direction * step) % n) + n) % n;
        if (!isDead(battleEnemies[idx])) {
            targetIndex = idx;
            return;
        }
    }
}

// Call from keyPressed()
function handleTargetKeys() {
    if (gameState.screen !== "battle") return;

    if (keyCode === LEFT_ARROW || keyCode === UP_ARROW) {
        cycleTarget(-1);
    } else if (keyCode === RIGHT_ARROW || keyCode === DOWN_ARROW) {
        cycleTarget(1);
    }
}