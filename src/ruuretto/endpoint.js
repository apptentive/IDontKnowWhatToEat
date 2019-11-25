const request = require('request-promise-native');
const { list } = require('../restaurant');

async function fireHandler(req, res) {
  

  await request.get(searchUrl, yelpAuth, (error, response, body) => { });

  const r = await list(req.body.yelpId);
  return res.send(r);
}

// 

module.exports = {
  fireHandler,
};
