const { list } = require('./list');
const { add } = require('./add');
const { listHandler, addHandler } = require('./endpoint');

module.exports = {
  list,
  listHandler,
  addHandler,
  add,
};
