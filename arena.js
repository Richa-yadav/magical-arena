// define the arena class
class Player {
    // Constructor for Player class
    // Initializes with name, health, strength, and attack attributes
    constructor(name, health, strength, attack) {
        this.name = name;
        this.health = health;
        this.strength = strength;
        this.attack = attack;
    }

    // Method to reduce the player's health by the given damage
    // Ensures health doesn't drop below 0
    takeDamage(damage) {
        this.health = Math.max(this.health - damage, 0);
    }

    // Method to check if the player is still alive
    // Returns true if health is greater than 0
    isAlive() {
        return this.health > 0;
    }
}

// Define the Die class
class Die {
    // Constructor for Die class
    // Initializes with the number of sides
    constructor(sides) {
        this.sides = sides;
    }

    // Method to roll the die and return a random number between 1 and the number of sides
    roll() {
        return Math.floor(Math.random() * this.sides) + 1;
    }
}

// Define the Arena class
class Arena {
    // Constructor for Arena class
    // Initializes with two players and two 6-sided dice
    constructor(playerA, playerB) {
        this.playerA = playerA;
        this.playerB = playerB;
        this.attackingDie = new Die(6);
        this.defendingDie = new Die(6);
    }

    // Method to determine the first attacker based on health
    // If health is equal, randomly select the first attacker
    getFirstAttacker() {
        if (this.playerA.health < this.playerB.health) {
            return this.playerA;
        } else if (this.playerA.health > this.playerB.health) {
            return this.playerB;
        } else {
            return Math.random() < 0.5 ? this.playerA : this.playerB;
        }
    }

    // Method to start the fight between the two players
    startFight() {
        // Determine the initial attacker and defender
        let attacker = this.getFirstAttacker();
        let defender = attacker === this.playerA ? this.playerB : this.playerA;

        // Continue fighting until one of the players is dead
        while (this.playerA.isAlive() && this.playerB.isAlive()) {
            console.log(`${attacker.name} attacks ${defender.name}`);

            // Roll the attack and defense dice
            const attackRoll = this.attackingDie.roll();
            const defenseRoll = this.defendingDie.roll();

            // Calculate attack damage and defense strength
            const attackDamage = attackRoll * attacker.attack;
            const defenseStrength = defenseRoll * defender.strength;
            const damageTaken = Math.max(attackDamage - defenseStrength, 0);

            console.log(`${attacker.name} rolls ${attackRoll} for attack (Damage: ${attackDamage})`);
            console.log(`${defender.name} rolls ${defenseRoll} for defense (Defended: ${defenseStrength})`);
            console.log(`${defender.name} takes ${damageTaken} damage`);

            // Apply damage to the defender
            defender.takeDamage(damageTaken);

            console.log(`${defender.name} health is now ${defender.health}`);

            // Check if the defender is still alive
            if (!defender.isAlive()) {
                console.log(`The winner is ${attacker.name}`);
                return;
            }

            // Swap the roles of attacker and defender for the next round
            [attacker, defender] = [defender, attacker];
        }
    }
}

// If the script is run directly, create two players and start a fight
if (require.main === module) {
    const playerA = new Player('Player A', 50, 5, 10);
    const playerB = new Player('Player B', 100, 10, 5);
    const arena = new Arena(playerA, playerB);
    arena.startFight();
}

// Export the Player, Die, and Arena classes
module.exports = { Player, Die, Arena };
