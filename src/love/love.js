const user = require('../user');

const loveCol = 'loves';
const hateCol = 'hates';

async function love(slackId, restaurantId) {
  await user.addMetaData(slackId, loveCol, restaurantId);
  await user.deleteMetaData(slackId, hateCol, restaurantId);
}

async function addLove(restaurants) {
  const users = await user.list();

  restaurants.forEach((r) => {
    const loves = users.map((u) => u.loves.filter((l) => l === r.id));
    // eslint-disable-next-line no-param-reassign
    r.loveCount = loves.reduce((p, c) => p.length + c.length);
  });

  restaurants.sort((a, b) => a.loveCount < b.loveCount);
}

async function hate(slackId, restaurantId) {
  await user.addMetaData(slackId, hateCol, restaurantId);
  await user.deleteMetaData(slackId, loveCol, restaurantId);
}

module.exports = {
  love,
  hate,
  addLove,
};
