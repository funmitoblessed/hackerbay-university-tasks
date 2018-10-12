const express = require('express');
const router = express.Router();


/* GET default page and return {status: success} */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Working with Handlebars', status: 'success' });
});

// Create POST API and return data from body
router.post('/data', function(req, res, next) {
    var data = req.body.data;
    res.json({ data: data });
});

module.exports = router;