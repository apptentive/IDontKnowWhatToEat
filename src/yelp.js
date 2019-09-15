var request = require("request-promise-native");

const location = {
  longitude: "-122.342080",
  latitude: "47.611044"
};

const yelpAuth = {
  auth: {
    bearer: process.env["YELP_TOKEN"]
  }
};

async function search(term) {
  const searchUrl = `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(
    term
  )}&latitude=${location.latitude}&longitude=${location.longitude}`;

  let businesses;

  await request.get(searchUrl, yelpAuth, (error, response, body) => {
    if (body) {
      const yelp = JSON.parse(body);

      businesses = yelp.businesses.map(b => {
        return {
          id: b.id,
          name: b.name,
          price: b.price,
          address: b.location.display_address,
          phone: b.phone,
          url: b.url,
          image: b.image_url
        };
      });
    }
  });

  return businesses;
}

module.exports = {
  search
};
