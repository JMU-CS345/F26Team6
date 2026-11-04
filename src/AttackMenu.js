class AttackMenu {
    constructor() {
        this.options = [
            "Attack",
            "Magic",
            "Item"
        ];
    }

    draw() {
        fill(50);
        rect(50, 400, 250, 150);

        fill(255);

        for(let i = 0; i < this.options.length; i++) {
            text(this.options[i], 75, 440 + 40 * i);
        }
    }
}