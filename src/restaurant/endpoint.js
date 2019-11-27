const { list } = require('./list');
const { add } = require('./add');

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

  if (req.body.limit) {
    listOpts.limit = parseInt(req.body.limit, 10) || 10;
  }

  if (req.body.categories) {
    listOpts.categories = JSON.parse(req.body.categories);
  }

  if (req.body.ruuretto) {
    listOpts.ruuretto = JSON.parse(req.body.ruuretto) || [];
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
