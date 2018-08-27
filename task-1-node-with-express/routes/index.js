const express = require('express');
const router = express.Router();


/* GET default page and return {status: success} */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Working with Handlebars', status: 'success' });
});

// Create POST API
router.post('/data', function(req, res, next) {
    // var data = req.body.data;
    // var anyString = req.body.anyString;
    res.redirect(200, '/data')
});

// GET Request to get the data saved with POST
router.get('/data', function(req, res, next) {
    res.render('data', { title: 'Get Request', data: 'My name is Funmito' });
});



module.exports = router;