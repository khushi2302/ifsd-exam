const prompt = require('prompt-sync')();

class Animal {
  constructor(name, lifespan) {
    this.name = name;
    this.lifespan = lifespan;
  }

  calculateRemainingYears(years) {
    return Math.max(this.lifespan - years, 0);
  }
}

class Zoo {
  constructor() {
    this.animals = [];
  }

  addAnimal(animal) {
    this.animals.push(animal);
  }

  countSurvivingAnimals(years) {
    let count = 0;
    for (let animal of this.animals) {
      if (animal.calculateRemainingYears(years) > 0) {
        count++;
      }
    }
    return count;
  }
}

function main() {
  let zoo = new Zoo();

  // Add animals to the zoo
  let animalNames = ['Lion', 'Elephant', 'Giraffe', 'Tiger'];
  for (let name of animalNames) {
    let lifespan = parseInt(prompt(`Enter the average lifespan of ${name}: `));
    let animal = new Animal(name, lifespan);
    zoo.addAnimal(animal);
  }

  let years = parseInt(prompt('Enter the number of years: '));

  let survivingAnimals = zoo.countSurvivingAnimals(years);

  console.log(`The number of animals that will be alive after ${years} years: ${survivingAnimals}`);
}

main();
