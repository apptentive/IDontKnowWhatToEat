const { list } = require('../restaurant');
const { addLove } = require('./love');

async function loveHandler(req, res) {
  const restaurants = await list();
  await addLove(restaurants);

  res.send(restaurants);
}

module.exports = {
  loveHandler,
};
