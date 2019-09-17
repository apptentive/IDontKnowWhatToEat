const fs = require('fs');

const dbPath = './db.json';

let entries = [];

function getAllEntries() {
  const rawdata = fs.readFileSync(dbPath, 'utf8');

  try {
    entries = JSON.parse(rawdata);
  } catch (err) {
    console.error('Unable to parse db, exiting');
    process.exit(1);
  }

  return entries;
}

async function getAll() {
  return entries;
}

async function add(restaurant) {
  const existingRestaurantIndex = entries.findIndex(
    (e) => e.id === restaurant.id,
  );

  if (existingRestaurantIndex >= 0) {
    entries[existingRestaurantIndex] = restaurant;
  } else {
    entries.push(restaurant);
  }

  const data = JSON.stringify(entries);
  fs.writeFileSync(dbPath, data);
}

async function seed() {
  add({ taco: 'tuesdays' });
}

function init() {
  if (fs.existsSync(dbPath)) {
    entries = getAllEntries();
  } else {
    const emptyList = [];

    const data = JSON.stringify(emptyList);

    fs.writeFileSync(dbPath, data);
  }
}

init();

module.exports = {
  add,
  seed,
  getAll,
};
