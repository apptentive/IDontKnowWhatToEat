const request = require('request-promise-native');

const location = {
  longitude: '-122.342080',
  latitude: '47.611044',
};

const yelpAuth = {
  auth: {
    bearer: process.env.YELP_TOKEN,
  },
};

async function search(term) {
  const searchUrl = `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(
    term,
  )}&latitude=${location.latitude}&longitude=${location.longitude}&limit=5`;

  let businesses;

  await request.get(searchUrl, yelpAuth, (error, response, body) => {
    if (body) {
      const yelp = JSON.parse(body);

      businesses = yelp.businesses.map((b) => ({
        id: b.id,
        name: b.name,
        price: b.price,
        address: b.location.display_address,
        phone: b.phone,
        url: b.url,
        image: b.image_url,
        distance: b.distance * 0.00062137, // Yelp returns meters, Murica!
      }));
    }
  });

  return businesses;
}

async function get(id) {
  const url = `https://api.yelp.com/v3/businesses/${id}`;

  let r;

  // eslint-disable-next-line consistent-return
  await request.get(url, yelpAuth, (error, response, body) => {
    if (error) {
      return Promise.reject(new Error(error));
    }

    const yelpBusiness = JSON.parse(body);
    r = {
      id: yelpBusiness.id,
      name: yelpBusiness.name,
      imageUrl: yelpBusiness.image_url,
      url: yelpBusiness.url,
      phone: yelpBusiness.phone,
      categories: yelpBusiness.categories,
      yelpRating: yelpBusiness.rating,
      address: yelpBusiness.location.address1,
      yelpPrice: yelpBusiness.price,
      location: yelpBusiness.coordinates,
    };
  });

  return r;
}

module.exports = {
  search,
  get,
};
