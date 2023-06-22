const mongoose = require('mongoose');
const prompt = require('prompt-sync')();

// MongoDB connection URI
const uri = 'mongodb+srv://khushi04:dehal04naruka@khushi.kdcswjf.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'zoo'; // Database name
const collectionName = 'animal';

// Define the animal schema
const animalSchema = new mongoose.Schema({
  name: String,
  lifespan: Number,
});

// Create the animal model
const Animal = mongoose.model('Animal', animalSchema);

async function addAnimals() {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const animals = [
    { name: 'lion', lifespan: 15 },
    { name: 'elephant', lifespan: 60 },
    { name: 'giraffe', lifespan: 25 },
    { name: 'tiger', lifespan: 10 },
  ];

  await Animal.insertMany(animals);
  console.log('Animals added successfully.');

  mongoose.disconnect();
}

async function findAnimalLifespan(animalName) {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const animal = await Animal.findOne({ name: animalName });
  if (animal) {
    console.log(`Lifespan for ${animalName}: ${animal.lifespan} years`);
    return animal;
  } else {
    console.log(`Animal "${animalName}" not found.`);
  }

  mongoose.disconnect();
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
    if (animal && animal.lifespan - years > 0) {
      survivingAnimals++;
    }
  }

  console.log(`The number of animals that will be alive after ${years} years: ${survivingAnimals}`);

  mongoose.disconnect();
}

main().catch(console.error);
