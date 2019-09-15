const storage = require("../storage");
const yelp = require("../yelp");
const util = require("./util");

async function parseAndExecute(ops) {
  if (!ops.actions) {
    return Promise.reject("no actions");
  }

  if (!ops.responseUrl) {
    return Promise.reject("no responseUrl");
  }

  ops.actions.forEach(async a => {
    if (a.action_id === "add_restaurant") {
      const r = await addRestaurant(a.value);
    }
  });
}

async function addRestaurant(id) {
  const r = await yelp.get(id);

  // const r = {
  //   id: yelpBusiness.id,
  //   name: yelpBusiness.name,
  //   imageUrl: yelpBusiness.image_url,
  //   url: yelpBusiness.url,
  //   phone: yelpBusiness.phone,
  //   categories: yelpBusiness.categories,
  //   yelpRating: yelpBusiness.rating,
  //   address: yelpBusiness.location.address1,
  //   yelpPrice: yelpBusiness.price
  // };

  if (r) {
    await storage.add(r);
  }

  return r;
}

module.exports = {
  parseAndExecute,
  addRestaurant
};
