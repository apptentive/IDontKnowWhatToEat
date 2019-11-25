const { list } = require('./list');
const { add } = require('./add');
const { getHandler } = require('./endpoint');

module.exports = {
  list,
  getHandler,
  add,
};
