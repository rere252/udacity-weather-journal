const port = 8000;

// Init dependencies.
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const journalRouter = require('./routes');

// Set up middleware.
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Serve the front-end site as well.
app.use(express.static('site'));

// Attach routes.
app.use(journalRouter);

// Start the app.
app.listen(port, 'localhost', () => console.log(`Listening on port ${port}`));
