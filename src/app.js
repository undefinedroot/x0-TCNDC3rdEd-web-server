const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
// app.use(...) = middleware
// app.set(...) = key/value pair

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Remove express header
app.set('x-powered-by', false);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.status(200).render('index', { title: 'Weather', name: 'Anon' });
});

app.get('/about', (req, res) => {
  res.status(200).render('about', { title: 'About', name: 'Anon' });
});

app.get('/help', (req, res) => {
  res.status(200).render('help', { title: 'Help', name: 'Anon', helpText: `< Pending Help >` });
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.status(400).send({ error: 'address required' });
  }
  geocode(req.query.address, (err_geo, { latitude, longitude, location } = {}) => {
    if (err_geo) {
      return res.status(400).send({ error: err_geo });
    }
    forecast(latitude, longitude, (err_fore, forecastData = {}) => {
      if (err_fore) {
        return res.status(400).send({ error: err_fore });
      }
      res.status(200).send({ forecast: forecastData, location, address: req.query.address });
    });
  });
});

app.get('/help/*', (req, res) => {
  res.status(404).render('404', { title: '404', errorMessage: 'Help article not found.', name: 'Anon' });
});

app.get('*', (req, res) => {
  res.status(404).render('404', { title: '404', errorMessage: 'Page not found.', name: 'Anon' });
});

// heroku provides a specific PORT
// it is randomly provided under the env variable
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}, ` +
  `LOCAL DATETIME: ${(new Date).toLocaleDateString()} ${(new Date).toLocaleTimeString()}`));