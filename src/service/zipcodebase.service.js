const fetch = require('node-fetch');
const cmdArgs = require('./cmd-args.service');

const zipcodebaseAPIKey = cmdArgs.zipcodebaseAPIKey;
const countryCode = cmdArgs.countryCode;

// Since just using a zip code sometimes returns a 404
// (at least this was the case when combined with the country code of Estonia).
// Using this as a fallback to get city name and then querying the OpenWeather API 
// again using city name instead.
async function getCityName(zipCode) {
  try {
    const url = getZipcodebaseAPIUrl(zipCode);
    const locationInfo = await fetch(url).then(resp => resp.json());
    const codeResults = locationInfo.results[zipCode];
    const city = codeResults[0].city;
    return city;
  } catch (e) {
    throw new Error(`No city not found for zip code ${zipCode}.`);
  }
}

function getZipcodebaseAPIUrl(zipCode) {
  return `https://app.zipcodebase.com/api/v1/search?apikey=${zipcodebaseAPIKey}&codes=${zipCode}&country=${countryCode.toLowerCase()}`;
}

// Exports
module.exports = {getCityName};
