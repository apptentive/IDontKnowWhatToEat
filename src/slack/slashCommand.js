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
  const business = await list({ names: [term] });
  util.respond(responseUrl, UI.buildRateRestaurantMessage(business[0]));
}

async function pickResturant(responseUrl, payload) {
  // TODO This shows the selectors, but no bulk sending of selection back and no session means not used.
  // const c = await categories.list();
  // util.respond(responseUrl, UI.buildRouletteSelectors(c));
  const business = await list({ limit: 1, ruuretto: [payload.user.id] });
  util.respond(responseUrl, UI.buildChosenRestaurantMessage(business[0]));
}

async function showHelp(responseUrl) {
  util.respond(responseUrl, {
    // eslint-disable-next-line no-use-before-define
    text: `Available Commands:\n${commands.map((h) => `\`${h.command}\`, \`${h.shortCommand}\`: \n>${h.helpText}`).join('\n')}`,
  });
}

const commands = [
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
    command: 'help',
    shortCommand: 'h',
    helpText: 'returns a list of avaliable commands',
    method: showHelp,
  },
  {
    command: 'pick',
    shortCommand: '(no command)',
    helpText: 'pick a resturant',
    method: pickResturant,
  },
  {
    command: 'rate',
    shortCommand: 'r',
    helpText: 'rate a resturant from the lists all our restaurants',
    method: rateResturant,
  },
];

async function parseAndExecute(slashCommandString, responseUrl, payload) {
  // eslint-disable-next-line no-param-reassign
  slashCommandString = slashCommandString.trim();
  const lower = slashCommandString.toLowerCase();

  if (!slashCommandString) {
    pickResturant(responseUrl, payload);
    return;
  }

  let shouldReturnHelpText = true;
  commands.forEach((c) => {
    if (lower.startsWith(c.command) || lower.startsWith(c.shortCommand)) {
      let start = c.shortCommand.length;
      if (lower.startsWith(c.command)) {
        start = c.command.length;
      }
      const params = slashCommandString.substring(start, slashCommandString.length).trim();

      c.method(responseUrl, params);
      shouldReturnHelpText = false;
    }
  });

  if (shouldReturnHelpText) {
    showHelp(responseUrl);
  }
}

module.exports = {
  parseAndExecute,
};
