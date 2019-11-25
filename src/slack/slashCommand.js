const yelp = require('../yelp');
const util = require('./util');
const categories = require('../categories');
const { list } = require('../restaurant');
const UI = require('./ui');

async function add(responseUrl, term) {
  const businesses = await yelp.search(term);
  util.respond(responseUrl, UI.buildAddRestaurantMessage(businesses));
}

async function listCategories(responseUrl) {
  const c = await categories.list();
  let text = c.sort().join(', ');

  if (!text) {
    text = 'No categories yet, be the first to add your favorite restaurant!';
  }

  await util.respond(responseUrl, {
    text,
  });
}

async function rateResturant(responseUrl, term) {
  const businesses = await list.search(term);
  util.respond(responseUrl, UI.buildRateRestaurantMessage(businesses));
}

const helpText = [
  {
    command: 'add',
    shortCommand: 'a',
    helpText: 'returns a list of restaurants that can be added to our list',
    method: add,
  },
  {
    command: 'categories',
    shortCommand: 'c',
    helpText: 'lists all categories for our restaurants',
    method: listCategories,
  },
  {
    command: 'rate',
    shortCommand: 'r',
    helpText: 'rate a resturant from the lists all our restaurants',
    method: rateResturant,
  },
];

async function parseAndExecute(slashCommandString, responseUrl) {
  // eslint-disable-next-line no-param-reassign
  slashCommandString = slashCommandString.trim();

  let shouldReturnHelpText = true;

  helpText.forEach((c) => {
    const lower = slashCommandString.toLowerCase();
    if (lower.startsWith(c.command) || lower.startsWith(c.shortCommand)) {
      let start = c.shortCommand.length;
      if (lower.startsWith(c.command)) {
        start = c.command.length;
      }

      c.method(responseUrl, slashCommandString.substring(start, slashCommandString.length).trim());

      shouldReturnHelpText = false;
    }
  });

  if (shouldReturnHelpText) {
    util.respond(responseUrl, {
      text: `Available Commands:\n${helpText
        .map((h) => `\`${h.command}\`, \`${h.shortCommand}\`: \n>${h.helpText}`)
        .join('\n')}`,
    });
  }
}

module.exports = {
  parseAndExecute,
};
