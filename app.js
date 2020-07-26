const port = 8000;
// TODO this is getting out of hand, named parameters should be used.
let countryCode = process.argv[2];
if (!countryCode) {
  console.warn('No country code provided, defaulting to "us".')
  countryCode = 'us';
}
const weatherAPIKey = process.argv[3];
if (!weatherAPIKey) {
  throw new Error('Missing OpenWeather API key.');
}
const zipCodeAPIKey = process.argv[4];
if (!zipCodeAPIKey) {
  console.warn('No Zipcodebase API key provided. No fallback to querying by city name if querying by zip code fails.');
}

// Init dependencies.
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

// Set up middleware.
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Serve the front-end site as well.
app.use(express.static('public'));

// The "database".
const journalEntries = [];

// Routes
app.post('/newEntry', async (req, resp) => {
  const data = req.body;
  const zipCode = data.zipCode;
  const feelings = data.feelings;
  try {
    const weatherEntry = await getCurrentWeatherEntryByZip(zipCode);
    const asEntryObject = toJournalEntry(weatherEntry, feelings);
    journalEntries.push(asEntryObject);
    resp.sendStatus(200);
    console.log('Inserted new journal entry: ' + JSON.stringify(asEntryObject));
  } catch (e) {
    console.error(e);
    resp.status(500).send(e);
  }
});

app.get('/allEntries', (req, resp) => resp.json(journalEntries));

// Handlers
async function getCurrentWeatherEntryByZip(zipCode) {
  const url = getZIPWeatherAPIUrl(zipCode);
  return await fetch(url)
    .then(resp => resp.json())
    .then(async json => {
      let weatherData;
      if (json.cod == 404) {
        // Fallback.
        const cityName = await getCityName(zipCode);
        weatherData = await getCurrentWeatherDataByCity(cityName);
      } else {
        weatherData = json;
      }
      const weather = weatherData.weather[0];
      if (weather) {
        const weatherDescr = weather.description;
        const temp = weatherData.main.temp;
        const celsiusSymbolHTML = '&#8451;';
        const weatherEntry = `${temp}${celsiusSymbolHTML}, ${weatherDescr}.`;
        return weatherEntry;
      }
      throw new Error(`Failed to find weather data for zip code "${zipCode}"`);
    });
}

async function getCurrentWeatherDataByCity(cityName) {
  const url = getCityWeatherAPIUrl(cityName);
  try {
    return await fetch(url).then(resp => resp.json());
  } catch (e) {
    throw new Error(`Failed to get weather data for city "${cityName}". Reason: ${e}`)
  }
}

// Since just using a zip code sometimes returns a 404
// (at least this was the case when combined with the country code of Estonia).
// Using this as a fallback to get city name and then querying the OpenWeather API 
// again using city name instead.
async function getCityName(zipCode) {
  const url = getZipcodebaseAPIUrl(zipCode);
  const locationInfo = await fetch(url).then(resp => resp.json());
  const codeResults = locationInfo.results[zipCode];
  if (codeResults.length > 0) {
    const city = codeResults[0].city;
    return city;
  } else {
    throw new Error('City not found.');
  }
}

// Util
const weatherBaseURL = 'http://api.openweathermap.org/data/2.5/weather?units=metric&';
function getZIPWeatherAPIUrl(zipCode) {
  return `${weatherBaseURL}zip=${zipCode},${countryCode.toLowerCase()}&appid=${weatherAPIKey}`;
}

function getCityWeatherAPIUrl(cityName) {
  // Two consecutive commas not a mistake, it's "unfilled" state value.
  return `${weatherBaseURL}q=${cityName},,${countryCode}&appid=${weatherAPIKey}`;
}

function getZipcodebaseAPIUrl(zipCode) {
  return `https://app.zipcodebase.com/api/v1/search?apikey=${zipCodeAPIKey}&codes=${zipCode}&country=${countryCode.toLowerCase()}`;
}

function toJournalEntry(weather, feelings) {
  return {weather, feelings};
}

// Start the app.
app.listen(port, 'localhost', () => console.log(`Listening on port ${port}`));

