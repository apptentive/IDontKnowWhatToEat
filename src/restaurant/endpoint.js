const { list } = require('./list');
const { add } = require('./add');

//   names: ['sushi', 'kudasai'],
//   restaurantId: 'totesRestaurantId'
//   distanceLess: .25, in miles
//   priceLess: 1,2,3,4
//   categories: ['sushi', 'kudasai']
async function listHandler(req, res) {
  const listOpts = {};

  if (req.body.names) {
    listOpts.names = req.body.names;
  }

  if (req.body.restaurantId) {
    listOpts.restaurantId = req.body.restaurantId;
  }

  if (req.body.distanceLess) {
    listOpts.distanceLess = req.body.distanceLess;
  }

  if (req.body.priceLess && parseInt(req.body.priceLess, 10)) {
    listOpts.priceLess = parseInt(req.body.priceLess, 10);
  }

  if (req.body.categories) {
    listOpts.categories = JSON.parse(req.body.categories);
  }

  const r = await list(listOpts);
  res.send(r);
}

async function addHandler(req, res) {
  if (!req.body.yelpId) {
    return res.status(400).send('yelpId is required');
  }

  const r = await add(req.body.yelpId);
  return res.send(r);
}

module.exports = {
  listHandler,
  addHandler,
};
