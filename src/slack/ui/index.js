const buildChosenRestaurantMessage = (r) => {
  const blocks = [
    {
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
    },
  ];

  return {
    blocks,
  };
};
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
            value: 'Coming Soon',
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

const buildRouletteSelectors = (categories = []) => {
  if (!categories.length) {
    return {};
  }

  return {
    text: 'To get started, narrow down the selection of resturants below.',
    response_type: 'in_channel',
    attachments: [
      {
        text: 'Choose a type of food:',
        fallback: 'You are unable to choose a type of food.',
        color: '#3AA3E3',
        attachment_type: 'default',
        callback_id: 'category_selection',
        actions: [
          {
            name: 'category_list',
            text: 'Select a category of food...',
            type: 'select',
            options: categories.map((category) => ({ text: category, value: category })),
          },
        ],
      },
      {
        text: "Choose a maximum distance you're willing to walk:",
        fallback: 'You are unable to choose a distance.',
        color: '#3AA3E3',
        attachment_type: 'default',
        callback_id: 'distance_selection',
        actions: [
          {
            name: 'distance_list',
            text: 'Select a distance...',
            type: 'select',
            options: [
              {
                text: 'Any',
                value: 'any',
              },
              {
                text: 'Near',
                value: 'near',
              },
              {
                text: 'Far',
                value: 'far',
              },
              {
                text: 'Real Far',
                value: 'real_far',
              },
            ],
          },
        ],
      },
      {
        text: "Choose a maximum price range you're willing to pay:",
        fallback: 'You are unable to choose a price range.',
        color: '#3AA3E3',
        attachment_type: 'default',
        callback_id: 'price_selection',
        actions: [
          {
            name: 'price_list',
            text: 'Select a price range...',
            type: 'select',
            options: [
              {
                text: '$',
                value: '1',
              },
              {
                text: '$$',
                value: '2',
              },
              {
                text: '$$$',
                value: '3',
              },
              {
                text: '$$$$',
                value: '4',
              },
            ],
          },
        ],
      },
      {
        text: 'Choose a minimum rating:',
        fallback: 'You are unable to choose a minimum rating.',
        color: '#3AA3E3',
        attachment_type: 'default',
        callback_id: 'rating_selection',
        actions: [
          {
            name: 'rating_list',
            text: 'Select a rating range...',
            type: 'select',
            options: [
              {
                text: '🙃',
                value: '1',
              },
              {
                text: '🙂',
                value: '2',
              },
              {
                text: '😃',
                value: '3',
              },
              {
                text: '🤩',
                value: '4',
              },
            ],
          },
        ],
      },
      // {
      //   text: '',
      //   fallback: 'You are unable to choose.',
      //   callback_id: 'submit',
      //   color: '#3AA3E3',
      //   attachment_type: 'default',
      //   actions: [
      //     {
      //       name: 'submit',
      //       text: 'Submit',
      //       type: 'button',
      //       value: 'submit',
      //     },
      //     {
      //       name: 'submit',
      //       text: 'Random',
      //       style: 'danger',
      //       type: 'button',
      //       value: 'random',
      //       confirm: {
      //         title: 'Are you sure?',
      //         text: 'The illusion of choice is the greatest magic trick ever performed.',
      //         ok_text: '🐶',
      //         dismiss_text: '🐱',
      //       },
      //     },
      //   ],
      // },
    ],
  };
};

module.exports = {
  buildChosenRestaurantMessage,
  buildAddRestaurantMessage,
  buildRateRestaurantMessage,
  buildRouletteSelectors,
};
