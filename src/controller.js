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
    resp.status(500).send(e.message);
  }
}

async function getAllEntries(req, resp) {
  return resp.json(journalEntries);
}

function toJournalEntry(weather, feelings) {
  const weatherEntry = weather.weatherEntry;
  const dateTime = weather.dateTime;
  return Object.freeze({
    id: journalEntries.length + 1,
    weatherEntry,
    dateTime,
    feelings
  });
}

// Exports
module.exports = {insertNewEntry, getAllEntries};
