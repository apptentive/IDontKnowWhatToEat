const { list } = require('../restaurant');
const { random } = require('../random');

async function fireHandler(req, res) {
  const rs = await list();
  const r = random(rs.length - 1, 0);

  // TODO: Filtering here

  return res.send(rs[r]);
}

module.exports = {
  fireHandler,
};
