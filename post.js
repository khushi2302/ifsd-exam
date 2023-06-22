const express = require('express');
const prompt = require('prompt-sync')();

// Create Animal model
class Animal {
  constructor(id, name, lifespan, age) {
    this.id = id;
    this.name = name;
    this.lifespan = lifespan;
    this.age = age;
  }
}

// Create Express app
const app = express();
app.use(express.json());

// In-memory storage for animals
const animals = [];
let counter = 1;

// Define API routes
app.get('/animals', (req, res) => {
  res.json(animals);
});

app.get('/animals/alive', (req, res) => {
  try {
    const years = parseInt(prompt('Enter the number of years: '));
    const aliveAnimals = animals.filter((animal) => animal.age < years);
    const aliveAnimalCount = aliveAnimals.length;
    console.log(`Number of animals alive after ${years} years: ${aliveAnimalCount}`);
    res.json({ count: aliveAnimalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve alive animals' });
  }
});

app.post('/animals', (req, res) => {
  try {
    const { name, lifespan, age } = req.body;
    const id = counter++;
    const animal = new Animal(id, name, lifespan, age);
    animals.push(animal);
    res.status(201).json(animal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create animal' });
  }
});

app.put('/animals/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, lifespan, age } = req.body;
    const animalIndex = animals.findIndex((animal) => animal.id === id);
    if (animalIndex !== -1) {
      animals[animalIndex] = { ...animals[animalIndex], name, lifespan, age };
      res.json(animals[animalIndex]);
    } else {
      res.status(404).json({ error: 'Animal not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update animal' });
  }
});

app.delete('/animals/:id', (req, res) => {
  try {
    const { id } = req.params;
    const animalIndex = animals.findIndex((animal) => animal.id === id);
    if (animalIndex !== -1) {
      animals.splice(animalIndex, 1);
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Animal not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete animal' });
  }
});

// Create animal from user input
app.post('/create-animal', (req, res) => {
  try {
    const name = prompt('Enter the name of the animal: ');
    const lifespan = parseInt(prompt(`Enter the lifespan of ${name}: `));
    const age = parseInt(prompt(`Enter the age of ${name}: `));
    const id = counter++;
    const animal = new Animal(id, name, lifespan, age);
    animals.push(animal);
    res.status(201).json(animal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create animal' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
