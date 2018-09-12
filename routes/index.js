const express = require('express');
const router = express.Router();


/* GET default page and return {status: success} */
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('index', { title: 'Simple Login API', status: 'success' });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // req.flash('error_msg', 'You are not logged in');
        res.redirect('/user/login');
    }
}

// Create POST API and return data from body
router.post('/data', function(req, res, next) {
    var data = req.body.data;
    res.json({ data: data });
});

module.exports = router;