const request = require("request");

async function respond(responseUrl, body) {
  var options = {
    method: "post",
    body: body,
    json: true,
    url: responseUrl
  };

  await request(options, err => {
    if (err) {
      console.error("error posting json: ", err);
    }
  });
}

module.exports = {
  respond
};
