const { list } = require('../restaurant');
// const { listUsers } = require('../user');

async function loveHandler(req, res) {
  const restaurants = await list();
  // const users = await listUsers();

  // TODO: Count restaurant id count across users
  // const rs = restaurants.map(r => )

  res.send(restaurants);
}

module.exports = {
  loveHandler,
};
