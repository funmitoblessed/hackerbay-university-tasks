const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const connection = require('./db');
const users = require('./routes/users');

app.use(bodyParser.json());

// Setting up the connection
connection
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.use('/users', users);


// GET REQUEST
app.get('/', (req, res) => {
    res.json('index');
});

app.post('/contact', urlencodedParser, (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.listen(8000, function() {
    console.log("app running on port 8000.");
});