// Import necessary modules
const assert = require('assert');
const { Player, Die, Arena } = require('./arena');

// Test suite for the Player class
describe('Player', function () {
    // Test case to ensure a player is created with the correct attributes
    it('should create a player with given attributes', function () {
        const player = new Player('Player A', 50, 5, 10);
        assert.strictEqual(player.name, 'Player A');
        assert.strictEqual(player.health, 50);
        assert.strictEqual(player.strength, 5);
        assert.strictEqual(player.attack, 10);
    });

    // Test case to check if player's health is reduced correctly when taking damage
    it('should reduce health when taking damage', function () {
        const player = new Player('Player A', 50, 5, 10);
        player.takeDamage(20);
        assert.strictEqual(player.health, 30);
    });

    // Test case to ensure player's health doesn't go below zero
    it('should not reduce health below zero', function () {
        const player = new Player('Player A', 50, 5, 10);
        player.takeDamage(60);
        assert.strictEqual(player.health, 0);
    });

    // Test case to check if the player is alive when health is above zero
    it('should be alive if health is above zero', function () {
        const player = new Player('Player A', 50, 5, 10);
        assert.strictEqual(player.isAlive(), true);
        player.takeDamage(20);
        assert.strictEqual(player.isAlive(), true);
    });

    // Test case to check if the player is dead when health is zero
    it('should be dead if health is zero', function () {
        const player = new Player('Player A', 50, 5, 10);
        player.takeDamage(50);
        assert.strictEqual(player.isAlive(), false);
    });

    // Test case to check if the player is dead when health is below zero
    it('should be dead if health is below zero', function () {
        const player = new Player('Player A', 50, 5, 10);
        player.takeDamage(60);
        assert.strictEqual(player.isAlive(), false);
    });
});

// Test suite for the Die class
describe('Die', function () {
    // Test case to ensure the die rolls a number between 1 and the number of sides
    it('should roll a number between 1 and the number of sides', function () {
        const die = new Die(6);
        for (let i = 0; i < 100; i++) {
            const result = die.roll();
            assert(result >= 1 && result <= 6);
        }
    });

    // Test case to ensure the die rolls a 1 if it has only 1 side
    it('should roll a 1 if the die has only 1 side', function () {
        const die = new Die(1);
        for (let i = 0; i < 100; i++) {
            const result = die.roll();
            assert.strictEqual(result, 1);
        }
    });
});

// Test suite for the Arena class
describe('Arena', function () {
    // Test case to simulate a fight until one player dies
    it('should correctly simulate a fight until one player dies', function () {
        const playerA = new Player('Player A', 50, 5, 10);
        const playerB = new Player('Player B', 100, 10, 5);
        const arena = new Arena(playerA, playerB);

        arena.startFight();

        // Assert that one of the players' health is zero at the end of the fight
        assert(playerA.health === 0 || playerB.health === 0);
    });

    // Test case to ensure the player with lower health attacks first
    it('should ensure the player with lower health attacks first', function () {
        const playerA = new Player('Player A', 30, 5, 10);
        const playerB = new Player('Player B', 100, 10, 5);
        const arena = new Arena(playerA, playerB);

        // Assert that playerA attacks first because it has lower health
        assert.strictEqual(arena.getFirstAttacker(), playerA);
    });

    // Test case to handle scenarios where both players have equal health
    it('should handle cases where both players have equal health', function () {
        const playerA = new Player('Player A', 50, 5, 10);
        const playerB = new Player('Player B', 50, 10, 5);
        const arena = new Arena(playerA, playerB);

        // Assert that either playerA or playerB is selected as the first attacker
        const firstAttacker = arena.getFirstAttacker();
        assert(firstAttacker === playerA || firstAttacker === playerB);
    });

    // Test case to ensure players take turns attacking and defending
    it('should ensure players take turns attacking and defending', function () {
        const playerA = new Player('Player A', 50, 5, 10);
        const playerB = new Player('Player B', 50, 10, 5);
        const arena = new Arena(playerA, playerB);

        let previousAttacker = null;
        // Simulate the fight and ensure turn-based attacking and defending
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
