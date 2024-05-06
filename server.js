// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start up an instance of app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

let projectData = {};
// POST
app.post('/add', (req, res) => {
  projectData['temperature'] = req.body.temperature;
  projectData['date'] = req.body.date;
  projectData['userResponse'] = req.body.userResponse;
  console.log('projectData', projectData);
  res.send(projectData);
});

// Initialize all route with a callback function
app.get('/all', (req, res) => {
  res.send(projectData);
});

// Set up and Spin up the server
const port = 8085;
const server = app.listen(port, () => {
    console.log(`server is listening on port: ${port}`);
});
