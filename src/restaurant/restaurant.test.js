const storage = require('../storage');
const { list } = require('./list');
const { add } = require('./add');

beforeEach(() => {
  storage.resetDb();
});

const ludisId = 'ultF6EfzuR_S3-QJyx67rw';

test('should be able to add restaurant', async () => {
  let rs = await list();
  expect(rs.length).toBe(0);

  await add(ludisId);
  rs = await list();
  expect(rs.length).toBe(1);
});

test('should be able to add restaurant twice, but only save first instance', async () => {
  let rs = await list();
  expect(rs.length).toBe(0);

  await add(ludisId);
  rs = await list();
  expect(rs.length).toBe(1);

  await add(ludisId);
  rs = await list();
  expect(rs.length).toBe(1);
});
