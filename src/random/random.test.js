
const { random } = require('./index');

test('should be random with no params', async () => {
  const r = await random();
  expect(r).toBeGreaterThan(0);
});

test('should be random with min', async () => {
  const r = await random(10, 5);
  expect(r).toBeGreaterThanOrEqual(5);
});

test('should be random with max only', async () => {
  const r = await random(10);
  expect(r).toBeGreaterThan(0);
});

test('should be random with max inclusive', async () => {
  const r = await random(10, 10);
  expect(r).toBe(10);
});
