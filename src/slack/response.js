const user = require('../user');
const util = require('./util');
const restaurant = require('../restaurant');

async function addRestaurant(id) {
  const r = await restaurant.add(id);

  return r;
}

async function parseAndExecute(ops) {
  if (!ops.actions) {
    return Promise.reject(new Error('no actions'));
  }

  if (!ops.responseUrl) {
    return Promise.reject(new Error('no responseUrl'));
  }

  if (!(ops.requester && ops.requester.slackId)) {
    return Promise.reject(new Error('need requester.slackId'));
  }

  ops.actions.forEach(async (a) => {
    if (a.action_id === 'add_restaurant') {
      const r = await addRestaurant(a.value);
      util.respond(ops.responseUrl, {
        text: `Thanks! We added ${r.name}`,
      });

      await user.addMetaData(ops.requester.slackId, 'addedRestaurants', r.id);
    }
  });

  return Promise.resolve();
}

module.exports = {
  parseAndExecute,
  addRestaurant,
};
