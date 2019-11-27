const Fuse = require('fuse.js');
const storage = require('../storage');
const { addDistance } = require('../office');
const { list: listUsers } = require('../user');
// const { random } = require('../random');

// criteria is optional and an object of and filters
// {
//   names: ['sushi', 'kudasai'],
//   restaurantId: 'totesRestaurantId'
//   distanceLess: .25, in miles
//   priceLess: 1,2,3,4
//   categories: ['sushi', 'kudasai']
//   ruuretto: ['slackIds'] GAMBLE TIME BABY!
//   limit: 10
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

    if (criteria.categories) {
      criteria.categories.forEach((cat) => {
        const catOpts = {
          keys: ['categories.title'],
        };

        const catFuse = new Fuse(rs, catOpts);
        rs = catFuse.search(cat);
      });
    }

    if (criteria.restaurantId) {
      rs = rs.filter((r) => r.id === criteria.restaurantId);
    }

    if (criteria.distanceLess) {
      await addDistance(rs);
      rs = rs.filter((r) => r.distance <= criteria.distanceLess);
    }

    if (criteria.priceLess) {
      rs = rs.filter((r) => r.yelpPrice.length <= criteria.priceLess);
    }

    if (criteria.ruuretto) {
      const users = await listUsers();

      if (users) {
        const filteredUsers = users.filter((u) => criteria.ruuretto.includes(u.slackId));
        let hatedRestaurants = filteredUsers.map((u) => u.hates);
        hatedRestaurants = hatedRestaurants.flat(Infinity);
        hatedRestaurants = [...new Set(hatedRestaurants)];

        rs = rs.filter((r) => !hatedRestaurants.includes(r.id));
      }
    }


    if (criteria.limit && criteria.limit < rs.length) {
      rs = rs.splice(0, criteria.limit);
    }
  }

  return rs;
}

module.exports = {
  list,
};
