var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* Signup */
router.get('/signup', function(req, res, next) {
    res.render('signup');
});

/* Login */
router.get('/login', function(req, res, next) {
    res.render('login');
});

// New User Signup POST API
router.post('/signup', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;


    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    //     if (errors) {
    //         res.render('signup', {
    //             errors: errors
    //         });
    //     } else {
    //         var newUser = new User({
    //             name: name,
    //             email: email,
    //             username: username,
    //             password: password
    //         });

    //         User.createUser(newUser, function(err, user) {
    //             if (err) throw err;
    //             console.log(user);
    //         });

    //         req.flash('success_msg', 'You are registered and can now login');

    //         res.redirect('/user/login');
    //     }

    //     console.log(name, email, username, password);
    // });


    if (errors) {
        res.render('signup', {
            errors: errors
        });
    } else {
        //checking for email and username are already taken
        User.findOne({
            username: {
                "$regex": "^" + username + "\\b",
                "$options": "i"
            }
        }, function(err, user) {
            User.findOne({
                email: {
                    "$regex": "^" + email + "\\b",
                    "$options": "i"
                }
            }, function(err, mail) {
                if (user || mail) {
                    res.render('signup', {
                        user: user,
                        mail: mail
                    });
                } else {
                    var newUser = new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password
                    });
                    User.createUser(newUser, function(err, user) {
                        if (err) throw err;
                        console.log(user);
                    });
                    req.flash('success_msg', 'You are registered and can now login');
                    res.redirect('/user/login');
                }
            });
        });
    }
});


// gets username and finds if it already exists. Also validates password
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'User does not exist' });
            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/user/login', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function(req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/user/login');
});


module.exports = router;