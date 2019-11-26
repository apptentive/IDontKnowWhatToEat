const office = {
  longitude: '-122.342080',
  latitude: '47.611044',
};

async function distance(longitude, latitude) {
  if ((office.longitude === longitude) && (office.latitude === latitude)) {
    return 0;
  }

  const radlat1 = (Math.PI * office.latitude) / 180;
  const radlat2 = (Math.PI * latitude) / 180;
  const theta = office.longitude - longitude;
  const radtheta = (Math.PI * theta) / 180;
  let dist = (Math.sin(radlat1) * Math.sin(radlat2))
    + (Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta));

  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  // if (unit=="K") { dist = dist * 1.609344 }
  // if (unit=="N") { dist = dist * 0.8684 }
  return dist;
}

async function addDistance(restaurants) {
  await restaurants.forEach(async (r) => {
    if (r.location && r.location.longitude && r.location.latitude) {
      // eslint-disable-next-line no-param-reassign
      r.distance = await distance(r.location.longitude, r.location.latitude);
    }
  });
}

module.exports = {
  location: office,
  distance,
  addDistance,
};
