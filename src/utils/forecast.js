const request = require('request');

const darksky_url = `https://api.darksky.net/forecast`;
const darksky_token = require('../../config/keys').darksky_token;

const forecast = (latitude, longitude, callback) => {
  const url = `${darksky_url}/${darksky_token}/${latitude},${longitude}?units=si`;
  request({ url, json: true }, (resErr, { body }) => {
    if (resErr) {
      callback('Unable to connect to weather service!', undefined);
    } else if (body.error) {
      callback('Unable to find location', undefined);
    } else {
      callback(undefined, {
        summary: body.daily.data[0].summary,
        temperature: body.currently.temperature,
        rain_chance: body.currently.precipProbability,
        temp_high: body.daily.data[0].apparentTemperatureHigh,
        temp_low: body.daily.data[0].apparentTemperatureLow,
      });
    }
  });
};

module.exports = forecast;