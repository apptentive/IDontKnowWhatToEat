const storage = require('../storage');
const {
  list,
  addRestaurant,
  removeRestaurant,
} = require('./user');

beforeEach(() => {
  storage.resetDb();
});

const ludisId = 'ultF6EfzuR_S3-QJyx67rw';

const person1Id = 'totesPerson1Id';
const person2Id = 'totesPerson2Id';

test('should be able to add restaurant twice, only 1 user', async () => {
  let users = await list();
  expect(users.length).toBe(0);

  await addRestaurant(person1Id, ludisId);

  users = await list();
  expect(users.length).toBe(1);

  await addRestaurant(person1Id, ludisId);

  users = await list();
  expect(users.length).toBe(1);
});

test('should be able to delete restaurant', async () => {
  let users = await list();
  expect(users.length).toBe(0);

  await addRestaurant(person1Id, ludisId);

  users = await list();
  expect(users.length).toBe(1);
  expect(users[0].addedRestaurants.length).toBe(1);
  expect(users[0].addedRestaurants[0]).toBe(ludisId);

  await removeRestaurant(person1Id, ludisId);

  users = await list();
  expect(users.length).toBe(1);
  expect(users[0].addedRestaurants.length).toBe(0);
});

test('should be able to add and list', async () => {
  let users = await list();
  expect(users.length).toBe(0);

  await addRestaurant(person1Id, ludisId);

  users = await list();
  expect(users.length).toBe(1);
});

// test('should be able to add twice', async () => {
//   let users = await list();
//   expect(users.length).toBe(0);

//   await addRestaurant(person1Id, ludisId);

//   users = await list();
//   expect(users.length).toBe(1);

//   await addRestaurant(person1Id, ludisId);
//   users = await list();
//   expect(users.length).toBe(1);
// });

// test('should be able to love a restaurant', async () => {
//   let users = await list();
//   expect(users.length).toBe(0);

//   await addRestaurant(person1Id, ludisId);

//   users = await list();
//   expect(users.length).toBe(1);

//   await love(person1Id, ludisId);
//   users = await list();
//   expect(users.length).toBe(1);
//   expect(users[0].loves.length).toBe(1);
// });

// test('two people should be able to add a restaurant', async () => {
//   let users = await list();
//   expect(users.length).toBe(0);

//   await addRestaurant(person1Id, ludisId);

//   users = await list();
//   expect(users.length).toBe(1);

//   await addRestaurant(person2Id, ludisId);

//   users = await list();
//   expect(users.length).toBe(2);

//   expect(users[0].addedRestaurants[0]).toBe(ludisId);
//   expect(users[1].addedRestaurants[0]).toBe(ludisId);
// });
