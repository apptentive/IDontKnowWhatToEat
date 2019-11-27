const storage = require('../storage');

async function list() {
  const us = await storage.getAllUsers();
  return us;
}

async function addMetaData(slackId, userColumn, obj) {
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
    user[userColumn].push(obj);
    user[userColumn] = [...new Set(user[userColumn])];
  }

  await storage.upsertUser(user);

  return user;
}

async function deleteMetaData(slackId, userColumn, obj) {
  if (!slackId) {
    return Promise.reject(new Error('Need slackId to update a user'));
  }

  if (!userColumn) {
    return Promise.reject(new Error('Need userColumn'));
  }

  const users = await list();
  const user = users.find((u) => u.slackId === slackId);

  if (!obj) {
    return Promise.resolve(user);
  }

  if (user && user[userColumn]) {
    user[userColumn] = user[userColumn].filter((c) => c !== obj);
  }

  await storage.upsertUser(user);

  return user;
}

// picks a restaurant given a set  
async function ruuretto() {

}

module.exports = {
  list,
  addMetaData,
  deleteMetaData,
};
