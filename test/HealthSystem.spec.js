describe("HealthSystem", () => {
  const enemy = (hp, maxHp = 30) => ({ hp, maxHp });

  beforeAll(() => {
    // p5 isn't loaded in the spec runner, so stand in for its max/min
    window.max = window.max || Math.max;
    window.min = window.min || Math.min;
  });

  beforeEach(() => {
    // fresh state before every spec
    window.battleEnemies = [];
    window.endBattle = jasmine.createSpy("endBattle");
    targetIndex = 0;
    player = { hp: 100, maxHp: 100 };
  });

  describe("damage", () => {
    it("reduces hp by the amount", () => {
      const e = enemy(30);
      battleEnemies = [e];
      damage(e, 10);
      expect(e.hp).toBe(20);
    });

    it("never takes hp below 0", () => {
      const e = enemy(10);
      battleEnemies = [e];
      damage(e, 50);
      expect(e.hp).toBe(0);
    });

    it("does not end the battle while another enemy is alive", () => {
      const a = enemy(10);
      const b = enemy(30);
      battleEnemies = [a, b];
      damage(a, 10);
      expect(endBattle).not.toHaveBeenCalled();
    });

    it("ends the battle when the last enemy dies", () => {
      const a = enemy(10);
      battleEnemies = [a];
      damage(a, 10);
      expect(endBattle).toHaveBeenCalledTimes(1);
    });
  });

  describe("heal", () => {
    it("increases hp by the amount", () => {
      player.hp = 50;
      heal(player, 20);
      expect(player.hp).toBe(70);
    });

    it("never goes above maxHp", () => {
      player.hp = 90;
      heal(player, 50);
      expect(player.hp).toBe(100);
    });
  });

  describe("isDead", () => {
    it("is true at 0 hp", () => {
      expect(isDead(enemy(0))).toBe(true);
    });

    it("is false with hp remaining", () => {
      expect(isDead(enemy(1))).toBe(false);
    });
  });

  describe("enemyMaxHp", () => {
    it("returns 100 for big enemies", () => {
      expect(enemyMaxHp("big")).toBe(100);
    });

    it("returns 30 for any other size", () => {
      expect(enemyMaxHp("small")).toBe(30);
      expect(enemyMaxHp(undefined)).toBe(30);
    });
  });

  describe("getTargetEnemy", () => {
    it("returns the first living enemy", () => {
      const a = enemy(30);
      battleEnemies = [a, enemy(30)];
      expect(getTargetEnemy()).toBe(a);
    });

    it("skips dead enemies and remembers the new target index", () => {
      const b = enemy(30);
      battleEnemies = [enemy(0), b];
      expect(getTargetEnemy()).toBe(b);
      expect(targetIndex).toBe(1);
    });

    it("wraps around to find a living enemy", () => {
      const a = enemy(30);
      battleEnemies = [a, enemy(0)];
      targetIndex = 1;
      expect(getTargetEnemy()).toBe(a);
      expect(targetIndex).toBe(0);
    });

    it("returns null when all enemies are dead", () => {
      battleEnemies = [enemy(0), enemy(0)];
      expect(getTargetEnemy()).toBeNull();
    });

    it("returns null when there are no enemies", () => {
      battleEnemies = [];
      expect(getTargetEnemy()).toBeNull();
    });
  });

  describe("allEnemiesDead", () => {
    it("is false when at least one enemy is alive", () => {
      battleEnemies = [enemy(0), enemy(5)];
      expect(allEnemiesDead()).toBe(false);
    });

    it("is true when every enemy is dead", () => {
      battleEnemies = [enemy(0), enemy(0)];
      expect(allEnemiesDead()).toBe(true);
    });
  });
});