const Fuse = require('fuse.js');
const storage = require('../storage');

// criteria is optional and an object of and filters
// {
//   names: ['sushi', 'kudasai'],
//   restaurantId: 'totesRestaurantId'
// }
async function list(criteria) {
  let rs = await storage.getAllRestaurants();

  if (criteria) {
    if (criteria.names) {
      criteria.names.forEach((name) => {
        const nameOpts = {
          keys: ['name'],
        };

        const nameFuse = new Fuse(rs, nameOpts);
        rs = nameFuse.search(name);
      });
    }

    if (criteria.restaurantId) {
      rs = rs.filter((r) => r.id === criteria.restaurantId);
    }
  }

  return rs;
}

module.exports = {
  list,
};
