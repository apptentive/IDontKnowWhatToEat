const user = require('../user');

const loveCol = 'loves';
const hateCol = 'hates';

async function love(slackId, restaurantId) {
  await user.addMetaData(slackId, loveCol, restaurantId);
  await user.deleteMetaData(slackId, hateCol, restaurantId);
}

async function hate(slackId, restaurantId) {
  await user.addMetaData(slackId, hateCol, restaurantId);
  await user.deleteMetaData(slackId, loveCol, restaurantId);
}

module.exports = {
  love,
  hate,
};
