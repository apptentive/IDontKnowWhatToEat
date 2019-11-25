const { list } = require('./list');
const { add } = require('./add');

async function listHandler(req, res) {
  const r = await list();
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
