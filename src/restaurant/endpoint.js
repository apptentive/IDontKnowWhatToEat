const { list } = require('./list');

async function getHandler(req, res) {
  const r = await list();
  res.send(r);
}

module.exports = {
  getHandler,
};
