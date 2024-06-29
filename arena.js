class Player {
    constructor(name, health, strength, attack) {
        this.name = name;
        this.health = health;
        this.strength = strength;
        this.attack = attack;
    }

    takeDamage(damage) {
        this.health = Math.max(this.health - damage, 0);
    }

    isAlive() {
        return this.health > 0;
    }
}

class Die {
    constructor(sides) {
        this.sides = sides;
    }

    roll() {
        return Math.floor(Math.random() * this.sides) + 1;
    }
}

class Arena {
    constructor(playerA, playerB) {
        this.playerA = playerA;
        this.playerB = playerB;
        this.attackingDie = new Die(6);
        this.defendingDie = new Die(6);
    }

    getFirstAttacker() {
        if (this.playerA.health < this.playerB.health) {
            return this.playerA;
        } else if (this.playerA.health > this.playerB.health) {
            return this.playerB;
        } else {
            return Math.random() < 0.5 ? this.playerA : this.playerB;
        }
    }

    startFight() {
        let attacker = this.getFirstAttacker();
        let defender = attacker === this.playerA ? this.playerB : this.playerA;

        while (this.playerA.isAlive() && this.playerB.isAlive()) {
            console.log(`${attacker.name} attacks ${defender.name}`);

            const attackRoll = this.attackingDie.roll();
            const defenseRoll = this.defendingDie.roll();
            const attackDamage = attackRoll * attacker.attack;
            const defenseStrength = defenseRoll * defender.strength;
            const damageTaken = Math.max(attackDamage - defenseStrength, 0);

            console.log(`${attacker.name} rolls ${attackRoll} for attack (Damage: ${attackDamage})`);
            console.log(`${defender.name} rolls ${defenseRoll} for defense (Defended: ${defenseStrength})`);
            console.log(`${defender.name} takes ${damageTaken} damage`);

            defender.takeDamage(damageTaken);

            console.log(`${defender.name} health is now ${defender.health}`);

            if (!defender.isAlive()) {
                console.log(`The winner is ${attacker.name}`);
                return;
            }

            [attacker, defender] = [defender, attacker];
        }
    }
}

if (require.main === module) {
    const playerA = new Player('Player A', 50, 5, 10);
    const playerB = new Player('Player B', 100, 10, 5);
    const arena = new Arena(playerA, playerB);
    arena.startFight();
}

module.exports = { Player, Die, Arena };
