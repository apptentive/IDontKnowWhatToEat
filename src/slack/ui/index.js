const buildAddRestaurantMessage = (restaurants) => {
  if (!restaurants || !restaurants.length || restaurants.length === 0) {
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'No resturants found. Be the first to add your favorite resturant.',
          },
        },
      ],
    };
  }

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
};

const buildRateRestaurantMessage = (restaurant) => {
  if (!restaurant) {
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'No resturant found. Maybe you are the first to rate it? If so, add it first.',
      },
    };
  }

  return {
    text: 'Please rate the resturant!',
    attachments: [
      {
        title: restaurant.name,
        fields: [
          {
            title: 'Category',
            value: restaurant.categories.map((category) => category.title).join(', '),
            short: true,
          },
          {
            title: 'Rating',
            value: '3% Positive',
            short: true,
          },
        ],
        // author_name: 'Resturant',
        // author_icon: restaurant.image,
        image_url: restaurant.imageUrl,
      },
      {
        fallback: `Did you love ${restaurant.name}?`,
        title: `Did you love ${restaurant.name}?`,
        callback_id: restaurant.id,
        color: '#3AA3E3',
        attachment_type: 'default',
        actions: [
          {
            name: 'love',
            text: 'Love ❤️',
            type: 'button',
            value: 'love',
          },
          {
            name: 'hate',
            text: 'Don\'t Love 💔',
            type: 'button',
            value: 'hate',
          },
        ],
      },
    ],
  };
};

module.exports = {
  buildAddRestaurantMessage,
  buildRateRestaurantMessage,
};
