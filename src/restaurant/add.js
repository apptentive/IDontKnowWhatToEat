const yelp = require('../yelp');
const storage = require('../storage');
const { list } = require('./list');

async function add(id) {
  const allRs = await list();
  const savedR = allRs.filter((r) => r.id === id);
  if (savedR.length > 0) {
    return savedR;
  }

  const r = await yelp.get(id);

  if (r) {
    await storage.add(r);
  }

  return r;
}

module.exports = {
  add,
};
