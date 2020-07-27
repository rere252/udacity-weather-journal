const apiService = require('./service/weather.service');

// The "database".
const journalEntries = [];

async function insertNewEntry(req, resp) {
  const data = req.body;
  const zipCode = data.zipCode;
  const feelings = data.feelings;
  try {
    const weatherEntry = await apiService.getCurrentWeatherEntryByZip(zipCode);
    const asEntryObject = toJournalEntry(weatherEntry, feelings);
    journalEntries.push(asEntryObject);
    resp.sendStatus(200);
    console.log('Inserted new journal entry: ' + JSON.stringify(asEntryObject));
  } catch (e) {
    console.error(e);
    resp.status(500).send(e.message);
  }
}

async function getAllEntries(req, resp) {
  return resp.json(journalEntries);
}

function toJournalEntry(data, feelings) {
  const dateTime = data.dateTime;
  return Object.freeze({
    id: journalEntries.length + 1,
    weather: data.weather,
    dateTime,
    feelings,
    location: data.location
  });
}

// Exports
module.exports = {insertNewEntry, getAllEntries};
