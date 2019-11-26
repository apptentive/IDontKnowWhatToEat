const fs = require('fs');

const dbPath = process.env.DB_PATH || './db.json';

let db = {
  restaurants: [],
  users: [],
};

function getDb() {
  const rawdata = fs.readFileSync(dbPath, 'utf8');

  try {
    db = JSON.parse(rawdata);
  } catch (err) {
    console.error('Unable to parse db, exiting');
    process.exit(1);
  }

  return db;
}

function writeDb() {
  fs.writeFileSync(dbPath, JSON.stringify(db));
}

// Deletes all database, should be used for testing only
function resetDb() {
  db.restaurants = [];
  db.users = [];
  writeDb();
}

async function getAllRestaurants() {
  return db.restaurants;
}

async function getAllUsers() {
  return db.users;
}

async function add(restaurant) {
  const existingRestaurantIndex = db.restaurants.findIndex((e) => e.id === restaurant.id);

  if (existingRestaurantIndex >= 0) {
    db.restaurants[existingRestaurantIndex] = restaurant;
  } else {
    db.restaurants.push(restaurant);
  }

  await writeDb();
}

async function upsertUser(user) {
  const existingUserIndex = db.users.findIndex((u) => u.slackId === user.slackId);

  if (existingUserIndex >= 0) {
    db.users[existingUserIndex] = user;
  } else {
    db.users.push(user);
  }

  await writeDb();
}

function init() {
  if (fs.existsSync(dbPath)) {
    db = getDb();
  } else {
    const data = JSON.stringify(db);
    fs.writeFileSync(dbPath, data);
  }
}

init();

module.exports = {
  getDb,
  add,
  getAllRestaurants,
  upsertUser,
  getAllUsers,
  resetDb,
};
