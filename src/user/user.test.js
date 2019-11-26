const storage = require('../storage');
const {
  list,
  addMetaData,
  deleteMetaData,
} = require('./index');

beforeEach(() => {
  storage.resetDb();
});

const restaurantId1 = 'ludis';
const restaurantId2 = 'crumpetShop';

const column = 'column';

const person1Id = 'totesPerson1Id';
const person2Id = 'totesPerson2Id';

test('should be maintain unique data', async () => {
  let users = await list();
  expect(users.length).toBe(0);

  await addMetaData(person1Id, column, restaurantId1);

  users = await list();
  expect(users.length).toBe(1);
  expect(users[0][column].length).toBe(1);
  expect(users[0][column][0]).toBe(restaurantId1);

  await addMetaData(person1Id, column, restaurantId1);

  users = await list();
  expect(users.length).toBe(1);
  expect(users[0][column].length).toBe(1);
  expect(users[0][column][0]).toBe(restaurantId1);
});

test('should be able to delete data from user', async () => {
  let users = await list();
  expect(users.length).toBe(0);

  await addMetaData(person1Id, column, restaurantId1);

  users = await list();
  expect(users.length).toBe(1);

  await deleteMetaData(person1Id, column, restaurantId1);

  users = await list();
  expect(users.length).toBe(1);
});

test('should be able to add same data to two users', async () => {
  let users = await list();
  expect(users.length).toBe(0);

  await addMetaData(person1Id, column, restaurantId1);

  users = await list();
  expect(users.length).toBe(1);
  expect(users[0][column][0]).toBe(restaurantId1);

  await addMetaData(person2Id, column, restaurantId2);

  users = await list();
  expect(users.length).toBe(2);
  expect(users[1][column][0]).toBe(restaurantId2);

  await deleteMetaData(person2Id, column, restaurantId2);

  users = await list();
  expect(users.length).toBe(2);
  expect(users[0][column][0]).toBe(restaurantId1);
  expect(users[1][column].length).toBe(0);
});
