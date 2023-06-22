const { MongoClient } = require('mongodb');
const prompt = require('prompt-sync')();

const uri = 'mongodb+srv://khushi04:dehal04naruka@khushi.kdcswjf.mongodb.net/?retryWrites=true&w=majority'; // MongoDB connection URI
const dbName = 'zoo'; // Database name
const collectionName = 'animals'; // Collection name

class Animal {
  constructor(name, lifespan) {
    this.name = name;
    this.lifespan = lifespan;
  }

  calculateRemainingYears(years) {
    return Math.max(this.lifespan - years, 0);
  }
}

async function addAnimals() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const animalsCollection = db.collection(collectionName);
    const animalDocuments = [
      { name: 'lion', lifespan: 15 },
      { name: 'elephant', lifespan: 60 },
      { name: 'giraffe', lifespan: 25 },
      { name: 'tiger', lifespan: 10 },
    ];
    await animalsCollection.insertMany(animalDocuments);
    console.log('Animals added successfully.');
  } finally {
    client.close();
  }
}

async function findAnimalLifespan(animalName) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const animalsCollection = db.collection(collectionName);
    const animal = await animalsCollection.findOne({ name: animalName });
    if (animal) {
      console.log(`Lifespan for ${animalName}: ${animal.lifespan} years`);
      return new Animal(animal.name, animal.lifespan);
    } else {
      console.log(`Animal "${animalName}" not found.`);
    }
  } finally {
    client.close();
  }
}

async function main() {
  // Add animals to the database
  await addAnimals();

  const animalNames = ['lion', 'elephant', 'giraffe', 'tiger'];

  // Find animal lifespans
  for (let animalName of animalNames) {
    await findAnimalLifespan(animalName);
  }

  const years = parseInt(prompt('Enter the number of years: '));

  let survivingAnimals = 0;

  // Calculate the number of surviving animals
  for (let animalName of animalNames) {
    const animal = await findAnimalLifespan(animalName);
    if (animal && animal.calculateRemainingYears(years) > 0) {
      survivingAnimals++;
    }
  }

  console.log(`The number of animals that will be alive after ${years} years: ${survivingAnimals}`);
}

main().catch(console.error);
