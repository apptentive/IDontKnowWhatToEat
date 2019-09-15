const yelp = require("./yelp");
var request = require("request-promise-native");

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
    respond(responseUrl, {
      text: helpText.map(h => `${h.command}: ${h.helpText}`).join("\n")
    });
  }
}

async function search(term, responseUrl) {
  const businesses = await yelp.search(term);
  respond(responseUrl, buildAddRestaurantMessage(businesses));
}

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

function buildAddRestaurantMessage(restaurants) {
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
        text: `*<${r.url}|${r.name}>*\nPrice: ${r.price}`
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
        text: "You can add an image next to text in this block."
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Add 🍴",
          emoji: true
        },
        value: "add_resturant"
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
