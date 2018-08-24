var express = require('express');
var router = express.Router();


/* GET default page and return {status: success} */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Working with Handlebars', status: 'success' });
});

module.exports = router;