const Fuse = require('fuse.js');
const storage = require('../storage');

// criteria is optional and an object of and filters
// {
//   names: ['sushi', 'kudasai'],
// }
async function list(criteria) {
  let rs = await storage.getAllRestaurants();

  if (criteria && criteria.names) {
    criteria.names.forEach((name) => {
      const nameOpts = {
        keys: ['name'],
      };

      const nameFuse = new Fuse(rs, nameOpts);
      rs = nameFuse.search(name);
    });
  }

  return rs;
}

module.exports = {
  list,
};
