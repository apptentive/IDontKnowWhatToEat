const express = require("express");
var bodyParser = require('body-parser')
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(function (req, res, next) {
  if(req && req.body && process.env['SLACK_TOKEN'] == req.body.token) {
    next()
  } else {
    res.send('Invalid Token')
  }
})

app.post("/", (req, res) => {
  res.send('Nice')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
