const storage = require('../storage');

async function list() {
  const restaurants = await storage.getAllRestaurants();
  const categories = restaurants.map((r) => r.categories.map((c) => c.title));
  const uniqueCategories = [...new Set(...categories)];

  return uniqueCategories;
}

module.exports = {
  list,
};
