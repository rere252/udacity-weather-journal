const fetch = require('node-fetch');
const cmdArgs = require('./cmd-args.service');
const zipcodebase = require('./zipcodebase.service');

const countryCode = cmdArgs.countryCode;
const weatherAPIKey = cmdArgs.weatherAPIKey;

// API requests.
async function getCurrentWeatherEntryByZip(zipCode) {
  const url = getZIPWeatherAPIUrl(zipCode);
  return await fetch(url)
    .then(resp => resp.json())
    .then(async json => {
      let weatherData;
      if (json.cod == 404) {
        // Fallback.
        const cityName = await zipcodebase.getCityName(zipCode);
        weatherData = await getCurrentWeatherDataByCity(cityName);
      } else {
        weatherData = json;
      }
      const weather = weatherData.weather[0];
      if (weather) {
        const weatherDescr = weather.description;
        const temp = Math.round(weatherData.main.temp);
        const celsiusSymbolHTML = '&#8451;';
        const weatherEntry = `${temp}${celsiusSymbolHTML}, ${weatherDescr}.`;
        const dateTime = formatDateTime(new Date(Date(weatherData.dt)));
        console.log(dateTime)
        return {weatherEntry, dateTime};
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

// Util
const weatherBaseURL = 'http://api.openweathermap.org/data/2.5/weather?units=metric&';
function getZIPWeatherAPIUrl(zipCode) {
  return `${weatherBaseURL}zip=${zipCode},${countryCode.toLowerCase()}&appid=${weatherAPIKey}`;
}

function getCityWeatherAPIUrl(cityName) {
  // Two consecutive commas not a mistake, it's "unfilled" state value.
  return `${weatherBaseURL}q=${cityName},,${countryCode}&appid=${weatherAPIKey}`;
}

function formatDateTime(date) {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

// Exports
module.exports = {getCurrentWeatherEntryByZip};
