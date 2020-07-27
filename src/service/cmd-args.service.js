const args = require('minimist')(process.argv.slice(2));

let countryCode = args.countryCode;
if (!countryCode) {
  console.warn('No country code provided, defaulting to "us".')
  countryCode = 'us';
}

const weatherAPIKey = args.weatherAPIKey;
if (!weatherAPIKey) {
  throw new Error('Missing OpenWeather API key.');
}

const zipcodebaseAPIKey = args.zipcodebaseAPIKey;
if (!zipcodebaseAPIKey) {
  console.warn('No Zipcodebase API key provided. No fallback to querying by city name if querying by zip code fails.');
}

// Exports
module.exports = {countryCode, weatherAPIKey, zipcodebaseAPIKey};
