class Battlefield {
    constructor(player, enemies) {
        this.player = player;
        this.enemies = enemies;
    }

    draw() {
        background(100);

        this.player.draw();

        for (let enemy of this.enemies) {
            enemy.draw();
        }
    }
}
