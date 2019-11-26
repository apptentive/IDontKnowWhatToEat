const Fuse = require('fuse.js');
const storage = require('../storage');
const { addLove } = require('../love');
const { addDistance } = require('../office');

// criteria is optional and an object of and filters
// {
//   names: ['sushi', 'kudasai'],
//   restaurantId: 'totesRestaurantId'
//   distanceLess: .25, in miles
//   priceLess: 1,2,3,4
//   categories: ['sushi', 'kudasai']
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

    if (criteria.distanceLess) {
      await addDistance(rs);
      rs = rs.filter((r) => r.distance <= criteria.distanceLess);
    }

    if (criteria.priceLess) {
      rs = rs.filter((r) => r.yelpPrice.length <= criteria.priceLess);
    }

    // TODO rando pick one thats loved plus unknown, plus 5% hated
    // if (criteria.lovedGreater) {
    //   if (!rs.loveCount) {
    //     addLove(rs);
    //   }
    //   rs = rs.filter((r) => r.loveCount === criteria.restaurantId);
    // }
  }

  return rs;
}

module.exports = {
  list,
};
