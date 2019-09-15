const express = require("express");
const bodyParser = require("body-parser");
const storage = require("./src/storage");
const slashCommand = require("./src/slashCommand");

const app = express();
const port = 3000;

if (!process.env["YELP_TOKEN"]) {
  console.error("PASS IN YELP_TOKEN as an environment variable");
  process.exit(1);
}

app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  if (!(req && req.body)) {
    res.send("No body to parse");
  }

  let token = req.body.token || undefined;

  // Message Responses put token payload
  if (req.body.payload) {
    const payload = JSON.parse(req.body.payload);
    token = payload.token;
  }

  if (process.env["SLACK_TOKEN"] == token) {
    next();
  } else {
    res.status(401).send("Invalid Token");
  }
});

app.post("/response", async (req, res) => {
  if (req && req.body && req.body.payload) {
    const thing = JSON.parse(req.body.payload);
    res.send();
  } else {
    res.err;
  }
});

app.post("/", async (req, res) => {
  slashCommand.parseAndExecute(req.body.text, req.body.response_url);
  res.send();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
