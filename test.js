const assert = require('assert');
const { Player } = require('./arena');

describe('Player', function() {
    it('should create a player with given attributes', function() {
        const player = new Player("Test", 100, 10, 15);
        assert.strictEqual(player.name, "Test");
        assert.strictEqual(player.health, 100);
        assert.strictEqual(player.strength, 10);
        assert.strictEqual(player.attack, 15);
    });

    it('should reduce health when taking damage', function() {
        const player = new Player("Test", 100, 10, 15);
        player.takeDamage(20);
        assert.strictEqual(player.health, 80);
    });

    it('should not reduce health below zero', function() {
        const player = new Player("Test", 100, 10, 15);
        player.takeDamage(120);
        assert.strictEqual(player.health, 0);
    });

    it('should be alive if health is above zero', function() {
        const player = new Player("Test", 100, 10, 15);
        assert.strictEqual(player.isAlive(), true);
        player.takeDamage(100);
        assert.strictEqual(player.isAlive(), false);
    });
});
