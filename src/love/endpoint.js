const { list } = require('../restaurant');
const { addLove, addHate } = require('./love');

async function loveHandler(req, res) {
  const restaurants = await list();
  await addLove(restaurants);

  res.send(restaurants);
}

async function hateHandler(req, res) {
  const restaurants = await list();
  await addHate(restaurants);

  res.send(restaurants);
}

module.exports = {
  loveHandler,
  hateHandler,
};
