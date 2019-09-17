const express = require('express');
const bodyParser = require('body-parser');
const storage = require('./src/storage');
const slack = require('./src/slack');

const app = express();
const port = 8080;

if (!process.env.YELP_TOKEN) {
  console.error('PASS IN YELP_TOKEN as an environment variable');
  process.exit(1);
}

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/db', async (req, res) => {
  const restaurants = await storage.getAll();
  res.send(restaurants);
});

app.use((req, res, next) => {
  if (!(req && req.body)) {
    res.send('No body to parse');
  }

  let token = req.body.token || undefined;

  // Message Responses put token in payload
  if (req.body.payload) {
    const payload = JSON.parse(req.body.payload);
    token = payload.token;
  }

  if (process.env.SLACK_TOKEN === token) {
    next();
  } else {
    res.status(401).send('Invalid Token');
  }
});

app.post('/response', async (req, res) => {
  if (req && req.body && req.body.payload) {
    const payload = JSON.parse(req.body.payload);

    slack.response.parseAndExecute({
      actions: payload.actions,
      responseUrl: payload.response_url,
      requester: {
        name: payload.user.name,
        slackId: payload.user.id,
      },
    });
  }

  res.send();
});

app.post('/', async (req, res) => {
  slack.slashCommand.parseAndExecute(req.body.text, req.body.response_url);
  res.send();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
