const storage = require('../storage');

async function list() {
  const us = await storage.getAllUsers();
  return us;
}

async function updateMetaDataString(slackId, userColumn, string) {
  if (!slackId) {
    return Promise.reject(new Error('Need slackId to update a user'));
  }

  const users = await list();
  let user = users.find((u) => u.slackId === slackId);

  if (!user) {
    user = { slackId };
    user[userColumn] = [];
  }

  if (user && user[userColumn]) {
    user[userColumn].push(string);
    user[userColumn] = [...new Set(user[userColumn])];
  }

  await storage.upsertUser(user);

  return user;
}

async function deleteMetaDataString(slackId, userColumn, string) {
  if (!slackId) {
    return Promise.reject(new Error('Need slackId to update a user'));
  }

  const users = await list();
  const user = users.find((u) => u.slackId === slackId);

  if (user && user[userColumn]) {
    user[userColumn] = user[userColumn].filter((c) => c !== string);
  }

  await storage.upsertUser(user);

  return user;
}

async function addRestaurant(slackId, restaurantId) {
  if (!slackId) {
    return Promise.reject(new Error('Need slackId to update a user'));
  }

  if (!restaurantId) {
    return Promise.reject(new Error('Need restaurantId to update a user'));
  }

  const user = updateMetaDataString(slackId, 'addedRestaurants', restaurantId);

  return user;
}

async function removeRestaurant(slackId, restaurantId) {
  if (!slackId) {
    return Promise.reject(new Error('Need slackId to update a user'));
  }

  if (!restaurantId) {
    return Promise.reject(new Error('Need restaurantId to update a user'));
  }

  const user = deleteMetaDataString(slackId, 'addedRestaurants', restaurantId);

  return user;
}

async function love(slackId, restaurantId) {
  if (!slackId) {
    return Promise.reject(new Error('Need slackId to update a user'));
  }

  if (!restaurantId) {
    return Promise.reject(new Error('Need restaurantId to update a user'));
  }

  const user = updateMetaDataString(slackId, 'loves', restaurantId);

  return user;
}

async function hate(slackId, restaurantId) {
  if (!slackId) {
    return Promise.reject(new Error('Need slackId to update a user'));
  }

  if (!restaurantId) {
    return Promise.reject(new Error('Need restaurantId to update a user'));
  }

  const user = updateMetaDataString(slackId, 'hate', restaurantId);

  return user;
}

module.exports = {
  addRestaurant,
  removeRestaurant,
  list,
  updateMetaDataString,
  deleteMetaDataString,
};
