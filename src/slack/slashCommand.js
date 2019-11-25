const yelp = require('../yelp');
const util = require('./util');
const storage = require('../storage');

function buildAddRestaurantMessage(restaurants) {
  restaurants.sort((a, b) => a.distance - b.distance);

  const message = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `We found *${restaurants.length} Restaurants* nearby, Use the button to pick ➜`,
      },
    },
  ];

  restaurants.forEach((r) => {
    message.push({
      type: 'divider',
    });

    message.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: [
          `*<${r.url}|${r.name}>*`,
          `Price: ${r.price}`,
          `Distance: ${Math.round(r.distance * 100) / 100}`,
          `Address: ${r.address}`,
          `Phone: ${r.phone}`,
        ].join('\n'),
      },
      accessory: {
        type: 'image',
        image_url: r.image,
        alt_text: r.name,
      },
    });

    message.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: "Add this restaurant to Apptentive's lunch list",
      },
      accessory: {
        type: 'button',
        action_id: 'add_restaurant',
        text: {
          type: 'plain_text',
          text: 'Add 🍴',
          emoji: true,
        },
        value: r.id,
      },
    });
  });

  return {
    blocks: message,
  };
}

async function add(responseUrl, term) {
  const businesses = await yelp.search(term);
  util.respond(responseUrl, buildAddRestaurantMessage(businesses));
}

async function listCategories(responseUrl) {
  const restaurants = await storage.getAllRestaurants();
  const categories = restaurants.map((r) => r.categories.map((c) => c.title));
  const uniqueCategories = [...new Set(...categories)];

  let text = uniqueCategories.sort().join(', ');

  if (!text) {
    text = 'No categories yet, be the first to add a restaurant';
  }

  await util.respond(responseUrl, {
    text,
  });
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
    command: 'love',
    shortCommand: 'l',
    helpText: 'love, or favorite, a restaurant',
    method: listCategories,
  },
];

async function parseAndExecute(slashCommandString, responseUrl) {
  // eslint-disable-next-line no-param-reassign
  slashCommandString = slashCommandString.trim();

  let shouldReturnHelpText = true;

  helpText.forEach((c) => {
    if (
      slashCommandString.toLowerCase().startsWith(c.command)
      || slashCommandString.toLowerCase().startsWith(c.shortCommand)
    ) {
      let start = c.shortCommand.length;

      if (slashCommandString.toLowerCase().startsWith(c.command)) {
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
