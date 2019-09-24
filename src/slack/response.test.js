const response = require('./response');
const storage = require('../storage');

describe('response', () => {
  beforeEach(() => {
    storage.resetDb();
  });

  const ludisId = 'ultF6EfzuR_S3-QJyx67rw';

  test('should be able to add restaurant', async () => {
    let rs = await storage.getAllRestaurants();
    expect(rs.length).toBe(0);

    await response.addRestaurant(ludisId);
    rs = await storage.getAllRestaurants();
    expect(rs.length).toBe(1);
  });

  test('should be able to add restaurant twice, but only save first instance', async () => {
    let rs = await storage.getAllRestaurants();
    expect(rs.length).toBe(0);

    await response.addRestaurant(ludisId);
    rs = await storage.getAllRestaurants();
    expect(rs.length).toBe(1);

    await response.addRestaurant(ludisId);
    rs = await storage.getAllRestaurants();
    expect(rs.length).toBe(1);
  });
});
