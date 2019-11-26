const storage = require('../storage');
const { list } = require('./list');
const { add } = require('./add');

beforeEach(() => {
  storage.resetDb();
});

const ludisId = 'ultF6EfzuR_S3-QJyx67rw';
const crumpetId = 'aX2ctpgS9uvFDfdzCXjecA';

test('should be able to find ludis', async () => {
  let rs = await list();
  expect(rs.length).toBe(0);

  await add(ludisId);
  rs = await list();
  expect(rs.length).toBe(1);

  const results = await list({
    names: ['lud'],
  });

  expect(results.length).toBe(1);
});

test('should be able to find ludis with crumpets around', async () => {
  let rs = await list();
  expect(rs.length).toBe(0);

  await add(ludisId);
  rs = await list();
  expect(rs.length).toBe(1);

  await add(crumpetId);
  rs = await list();
  expect(rs.length).toBe(2);

  const results = await list({
    names: ['lud'],
  });

  expect(results.length).toBe(1);
});

test('should be able to find ludis by id', async () => {
  let rs = await list();
  expect(rs.length).toBe(0);

  await add(ludisId);
  rs = await list();
  expect(rs.length).toBe(1);

  await add(crumpetId);
  rs = await list();
  expect(rs.length).toBe(2);

  const results = await list({
    restaurantId: ludisId,
  });

  expect(results.length).toBe(1);
  expect(results[0].id).toBe(ludisId);
});
