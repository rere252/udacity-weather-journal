const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.post('/newEntry', controller.insertNewEntry);
router.get('/allEntries', controller.getAllEntries);

// Export
module.exports = router;
