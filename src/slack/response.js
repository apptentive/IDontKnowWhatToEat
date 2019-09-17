const storage = require("../storage");
const yelp = require("../yelp");
const util = require("./util");

async function parseAndExecute(ops) {
  if (!ops.actions) {
    return Promise.reject("no actions");
  }

  if (!ops.responseUrl) {
    return Promise.reject("no responseUrl");
  }

  ops.actions.forEach(async a => {
    if (a.action_id === "add_restaurant") {
      const r = await addRestaurant(a.value);
      util.respond(ops.responseUrl, {
        text: `Thanks! We added ${r.name}`
      });
    }
  });
}

async function addRestaurant(id) {
  const r = await yelp.get(id);

  if (r) {
    await storage.add(r);
    return r;
  }
}

module.exports = {
  parseAndExecute
};
