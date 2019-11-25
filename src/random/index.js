const request = require('request-promise-native');

/* eslint-disable no-param-reassign */
async function random(max, min) {
  if (!min) {
    min = 1;
  }

  if (!max) {
    max = 10;
  }

  const randomUrl = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

  let r = -1;

  await request.get(randomUrl, {}, (error, response, body) => {
    if (error) {
      r = Math.floor(Math.random() * (max - min + 1) + min);
    }

    if (body) {
      r = JSON.parse(body);
    }
  });

  return r;
}

module.exports = {
  random,
};
