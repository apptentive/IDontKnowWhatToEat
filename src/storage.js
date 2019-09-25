const fs = require('fs');

const dbPath = './db.json';

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

async function add(restaurant) {
  const existingRestaurantIndex = db.restaurants.findIndex((e) => e.id === restaurant.id);

  if (existingRestaurantIndex >= 0) {
    db.restaurants[existingRestaurantIndex] = restaurant;
  } else {
    db.restaurants.push(restaurant);
  }

  await writeDb();
}

async function updateUserReview(ops) {
  if (!ops.slackId) {
    return Promise.reject(new Error('Need slackId to update a user'));
  }

  if (!ops.yelpId) {
    return Promise.reject(new Error('Need yelpId to update a user'));
  }

  const userIndex = db.users.findIndex((u) => u.slackId === ops.slackId);

  if (userIndex >= 0) {
    db.users[userIndex].addedRestaurants.push(ops.yelpId);
  } else {
    db.users.push({
      slackId: ops.slackId,
      addedRestaurants: [ops.yelpId],
    });
  }

  return writeDb();
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
  updateUserReview,
  resetDb,
};
