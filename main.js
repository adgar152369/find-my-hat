const chalk = require("chalk");
const prompt = require('prompt-sync')({ sigint: true });
const hat = '^';
const hole = 'O';
const fieldChar = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
    this.gameWon = false;
    this.gameLost = false;
    this.playerPosition = [0, 0];
    this.hatPosition = null;
    this.hatPlaced = false;
  }

  playGame() {
    while (!this.gameLost) {
      let direction = prompt(chalk.blue('What direction would you like to move? (w, n, s, e)')).toLowerCase();
      this.determinePosition(direction);
      this.determineGameWon();
      if (!this.gameLost) this.print();
      if (this.gameWon) return;
    }
  }

  checkIfFellInHole() {
    const [row, col] = this.playerPosition;
    if (this.field[row][col] === hole) {
      console.log(chalk.red("Oh no! You fell in a hole!"));
      this.gameLost = true;
    }
  }

  determinePosition(direction) {
    if (direction === 'n' && this.playerPosition[0] > 0) this.playerPosition[0]--;
    else if (direction === 's' && this.playerPosition[0] < this.field.length - 1) this.playerPosition[0]++;
    else if (direction === 'e' && this.playerPosition[1] < this.field[0].length - 1) this.playerPosition[1]++;
    else if (direction === 'w' && this.playerPosition[1] > 0) this.playerPosition[1]--;
    else {
      console.log(chalk.red("Out of bounds!"));
      this.gameLost = true;
    }
    this.checkIfFellInHole();
  }

  static generateField(h, w, p) {
    let percentageOfHoles = p / 100;
    let newField = [];

    // create field with only field chars
    for (let i = 0; i < h; i++) {
      newField.push([])
      for (let j = 0; j < w; j++) {
        newField[i].push(fieldChar)
      }
    }
    // insert holes based on percentage
    for (let row = 0; row < newField.length; row++) {
      for (let col = 0; col < newField[row].length; col++) {
        const random = Math.random();
        newField[row][col] = random > percentageOfHoles ? fieldChar : hole;
      }
    }

    return newField;
  }

  determineGameWon() {
    let hatLocation = this.hatPosition;
    let playerLocation = this.playerPosition;

    if (hatLocation.join("") === playerLocation.join("")) {
      console.log(chalk.green('Congratulations! You found your hat!'));
      this.gameWon = true;
    }
  }

  placeHat() {
    let h = this.field.length;
    let w = this.field[0].length;

    while (!this.hatPlaced) {
      let row = Math.floor(Math.random() * h);
      let col = Math.floor(Math.random() * w);
      if (this.field[row][col] !== hole) {
        this.hatPosition = [row, col];
        this.field[row][col] = hat;
        this.hatPlaced = true;
      }
    }
  }

  print() {
    this.field[this.playerPosition[0]][this.playerPosition[1]] = pathCharacter;
    if (this.field.length > 0) this.placeHat();
    this.field.forEach((spot) => console.log(spot.join(" ")))
  }
}

const myField = new Field(Field.generateField(10, 5, 20));
myField.print();
myField.playGame();
