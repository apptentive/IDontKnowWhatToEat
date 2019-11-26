const { list } = require('../restaurant');
const { list: listUsers } = require('../user');

async function loveHandler(req, res) {
  const restaurants = await list();
  const users = await listUsers();

  restaurants.forEach((r) => {
    const loves = users.map((u) => u.loves.filter((l) => l === r.id));
    // eslint-disable-next-line no-param-reassign
    r.loveCount = loves.reduce((p, c) => p.length + c.length);
  });

  res.send(restaurants);
}

module.exports = {
  loveHandler,
};
