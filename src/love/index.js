const { love, hate, addLove } = require('./love');
const { loveHandler } = require('./endpoint');

module.exports = {
  love,
  addLove,
  hate,
  loveHandler,
};
