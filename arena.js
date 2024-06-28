class Player {
    constructor(name, health, strength, attack) {
        this.name = name;
        this.health = health;
        this.strength = strength;
        this.attack = attack;
    }

    isAlive() {
        return this.health > 0;
    }

    takeDamage(damage) {
        this.health = Math.max(this.health - damage, 0);
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

    startFight() {
        while (this.playerA.isAlive() && this.playerB.isAlive()) {
            this.fightRound();
        }

        const winner = this.playerA.isAlive() ? this.playerA.name : this.playerB.name;
        console.log(`The winner is ${winner}`);
    }

    fightRound() {
        let attacker, defender;

        if (this.playerA.health <= this.playerB.health) {
            attacker = this.playerA;
            defender = this.playerB;
        } else {
            attacker = this.playerB;
            defender = this.playerA;
        }

        console.log(`${attacker.name} attacks ${defender.name}`);
        this.attack(attacker, defender);

        if (!defender.isAlive()) return;

        console.log(`${defender.name} counterattacks ${attacker.name}`);
        this.attack(defender, attacker);
    }

    attack(attacker, defender) {
        const attackRoll = this.attackingDie.roll();
        const defendRoll = this.defendingDie.roll();

        const attackDamage = attacker.attack * attackRoll;
        const defendValue = defender.strength * defendRoll;
        const damageDealt = Math.max(attackDamage - defendValue, 0);

        console.log(`${attacker.name} rolls ${attackRoll} for attack (Damage: ${attackDamage})`);
        console.log(`${defender.name} rolls ${defendRoll} for defense (Defended: ${defendValue})`);
        console.log(`${defender.name} takes ${damageDealt} damage`);

        defender.takeDamage(damageDealt);
        console.log(`${defender.name} health is now ${defender.health}`);
    }
}

const playerA = new Player("Player A", 50, 5, 10);
const playerB = new Player("Player B", 100, 10, 5);

const arena = new Arena(playerA, playerB);
arena.startFight();

module.exports={Player, Die, Arena};