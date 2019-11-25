const { list } = require('./list');

async function handler(req, res) {
  const r = await list();
  res.send(r);
}

module.exports = {
  handler,
};
