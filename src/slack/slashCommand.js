const request = require("request-promise-native");
const yelp = require("../yelp");
const util = require("./util");

const helpText = [
  {
    command: "search",
    helpText: "for lunch options near the office",
    method: search
  }
];

async function parseAndExecute(slashCommandString, responseUrl) {
  slashCommandString = slashCommandString.trim();

  let shouldReturnHelpText = true;

  helpText.forEach(c => {
    if (slashCommandString.toLowerCase().startsWith(c.command)) {
      c.method(
        slashCommandString
          .substring(c.command.length, slashCommandString.length)
          .trim(),
        responseUrl
      );
      shouldReturnHelpText = false;
    }
  });

  if (shouldReturnHelpText) {
    util.respond(responseUrl, {
      text: helpText.map(h => `${h.command}: ${h.helpText}`).join("\n")
    });
  }
}

async function search(term, responseUrl) {
  const businesses = await yelp.search(term);
  util.respond(responseUrl, buildAddRestaurantMessage(businesses));
}

function buildAddRestaurantMessage(restaurants) {
  restaurants.sort((a, b) => a.distance - b.distance);

  const message = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `We found *${restaurants.length} Resturants* nearby, Use the button to pick ➜`
      }
    }
  ];

  restaurants.forEach(r => {
    message.push({
      type: "divider"
    });

    message.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: [
          `*<${r.url}|${r.name}>*`,
          `Price: ${r.price}`,
          `Distance: ${Math.round(r.distance * 100) / 100}`,
          `Address: ${r.address}`,
          `Phone: ${r.phone}`
        ].join("\n")
      },
      accessory: {
        type: "image",
        image_url: r.image,
        alt_text: r.name
      }
    });

    message.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Add this restaurant to Apptentive's lunch list"
      },
      accessory: {
        type: "button",
        action_id: "add_restaurant",
        text: {
          type: "plain_text",
          text: "Add 🍴",
          emoji: true
        },
        value: r.id
      }
    });
  });

  return {
    blocks: message
  };
}

module.exports = {
  parseAndExecute,
  search
};
