const storage = require('../storage');

async function list() {
  const r = await storage.getAllRestaurants();
  return r;
}

module.exports = {
  list,
};
