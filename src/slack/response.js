const storage = require('../storage');
const yelp = require('../yelp');
const util = require('./util');

async function addRestaurant(id) {
  const r = await yelp.get(id);

  if (r) {
    await storage.add(r);
  }

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

      console.log('asdf');

      await storage.updateUserReview({
        slackId: ops.requester.slackId,
        yelpId: r.id,
      });
    }
  });

  return Promise.resolve();
}

module.exports = {
  parseAndExecute,
};
