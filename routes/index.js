const express = require('express');
const router = express.Router();


/* GET default page and return {status: success} */
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('index', { title: 'Simple Login API', status: 'success' });
});

// Create POST API
router.post('/data', function(req, res, next) {
    var data = req.body.anyString;
    res.render('data', { data })
});

module.exports = router;