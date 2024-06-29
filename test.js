const assert = require('assert');
const { Player, Die, Arena } = require('./arena');

describe('Player', function () {
    it('should create a player with given attributes', function () {
        const player = new Player('Player A', 50, 5, 10);
        assert.strictEqual(player.name, 'Player A');
        assert.strictEqual(player.health, 50);
        assert.strictEqual(player.strength, 5);
        assert.strictEqual(player.attack, 10);
    });

    it('should reduce health when taking damage', function () {
        const player = new Player('Player A', 50, 5, 10);
        player.takeDamage(20);
        assert.strictEqual(player.health, 30);
    });

    it('should not reduce health below zero', function () {
        const player = new Player('Player A', 50, 5, 10);
        player.takeDamage(60);
        assert.strictEqual(player.health, 0);
    });

    it('should be alive if health is above zero', function () {
        const player = new Player('Player A', 50, 5, 10);
        assert.strictEqual(player.isAlive(), true);
        player.takeDamage(20);
        assert.strictEqual(player.isAlive(), true);
    });

    it('should be dead if health is zero', function () {
        const player = new Player('Player A', 50, 5, 10);
        player.takeDamage(50);
        assert.strictEqual(player.isAlive(), false);
    });

    it('should be dead if health is below zero', function () {
        const player = new Player('Player A', 50, 5, 10);
        player.takeDamage(60);
        assert.strictEqual(player.isAlive(), false);
    });
});

describe('Die', function () {
    it('should roll a number between 1 and the number of sides', function () {
        const die = new Die(6);
        for (let i = 0; i < 100; i++) {
            const result = die.roll();
            assert(result >= 1 && result <= 6);
        }
    });

    it('should roll a 1 if the die has only 1 side', function () {
        const die = new Die(1);
        for (let i = 0; i < 100; i++) {
            const result = die.roll();
            assert.strictEqual(result, 1);
        }
    });
});

describe('Arena', function () {
    it('should correctly simulate a fight until one player dies', function () {
        const playerA = new Player('Player A', 50, 5, 10);
        const playerB = new Player('Player B', 100, 10, 5);
        const arena = new Arena(playerA, playerB);

        arena.startFight();

        assert(playerA.health === 0 || playerB.health === 0);
    });

    it('should ensure the player with lower health attacks first', function () {
        const playerA = new Player('Player A', 30, 5, 10);
        const playerB = new Player('Player B', 100, 10, 5);
        const arena = new Arena(playerA, playerB);

        assert.strictEqual(arena.getFirstAttacker(), playerA);
    });

    it('should handle cases where both players have equal health', function () {
        const playerA = new Player('Player A', 50, 5, 10);
        const playerB = new Player('Player B', 50, 10, 5);
        const arena = new Arena(playerA, playerB);

        const firstAttacker = arena.getFirstAttacker();
        assert(firstAttacker === playerA || firstAttacker === playerB);
    });

    it('should ensure players take turns attacking and defending', function () {
        const playerA = new Player('Player A', 50, 5, 10);
        const playerB = new Player('Player B', 50, 10, 5);
        const arena = new Arena(playerA, playerB);

        let previousAttacker = null;
        while (playerA.isAlive() && playerB.isAlive()) {
            const currentAttacker = previousAttacker === playerA ? playerB : playerA;
            assert.notStrictEqual(currentAttacker, previousAttacker);

            const defender = currentAttacker === playerA ? playerB : playerA;
            const attackRoll = arena.attackingDie.roll();
            const defenseRoll = arena.defendingDie.roll();
            const attackDamage = attackRoll * currentAttacker.attack;
            const defenseStrength = defenseRoll * defender.strength;
            const damageTaken = Math.max(attackDamage - defenseStrength, 0);
            defender.takeDamage(damageTaken);

            previousAttacker = currentAttacker;
        }
    });
});
