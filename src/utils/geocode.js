const request = require('request');

const mapbox_url = `https://api.mapbox.com/geocoding/v5/mapbox.places`;
const mapbox_token = require('../../config/keys').mapbox_token;

const geocode = (address, callback) => {
  const url = `${mapbox_url}/${encodeURI(address)}.json?access_token=${mapbox_token}&limit=1`;
  request({ url, json: true }, (resErr, { body }) => {
    if (resErr) {
      callback('Unable to connect to geocode service!', undefined);
    } else if (body.features.length === 0) {
      callback('Unable to find location!', undefined);
    } else {
      callback(undefined, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location: body.features[0].place_name
      });
    }
  });
};

module.exports = geocode;