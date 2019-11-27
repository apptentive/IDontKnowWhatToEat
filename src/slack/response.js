const user = require('../user');
const util = require('./util');
const restaurant = require('../restaurant');
const { love, hate } = require('../love');

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

  // Timestamp for keeping track of session
  // const session = ops.original_message.ts;
  // if (ops.callback_id === 'category_selection') {
  //   const { value } = ops.actions[0].selected_options[0];
  // }
  // if (ops.callback_id === 'distance_list') {
  //   const { value } = ops.actions[0].selected_options[0];
  // }
  // if (ops.callback_id === 'price_selection') {
  //   const { value } = ops.actions[0].selected_options[0];
  // }
  // if (ops.callback_id === 'rating_selection') {
  //   const { value } = ops.actions[0].selected_options[0];
  // }

  ops.actions.forEach(async (a) => {
    if (a.action_id === 'add_restaurant') {
      const r = await addRestaurant(a.value);
      util.respond(ops.responseUrl, {
        text: `Thanks! We added ${r.name}`,
      });

      await user.addMetaData(ops.requester.slackId, 'addedRestaurants', r.id);
      return;
    }

    if (a.name === 'love') {
      util.respond(ops.responseUrl, {
        text: `Sweet, you ${a.value} it!`,
      });
      await love(ops.requester.slackId, ops.callback_id);
      return;
    }
    if (a.name === 'hate') {
      util.respond(ops.responseUrl, {
        text: `Sweet, you ${a.value} it!`,
      });
      await hate(ops.requester.slackId, ops.callback_id);
    }
  });

  return Promise.resolve();
}

module.exports = {
  parseAndExecute,
  addRestaurant,
};
