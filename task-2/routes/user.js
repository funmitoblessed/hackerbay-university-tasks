const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
''


// Get user model
const User = require('../models/user');

// User Signup
router.get('/signup', function(req, res) {
    res.render('signup');
});


// Login
router.get('/login', function(req, res) {
    res.render('login');
});


// Register User
router.post('/signup', function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;

    console.log(email, password);

    // Validation
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('signup', {
            errors: errors
        });
    } else {
        let newUser = new User({
            email: email,
            password: password
        });

        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/user/login');
    };

});


passport.use(new LocalStrategy(
    function(email, password, done) {
        User.getUserByEmail(email, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
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


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


module.exports = router;

// if (errors) {
//     res.render('signup', {
//         errors: errors
//     });
// } else {
//     //checking for email and username are already taken
//     User.findOne({
//         email: {
//             "$regex": "^" + email + "\\b",
//             "$options": "i"
//         }
//     }, function(err, user) {
//         User.findOne({
//             email: {
//                 "$regex": "^" + email + "\\b",
//                 "$options": "i"
//             }
//         }, function(err, mail) {
//             if (user || mail) {
//                 res.render('signup', {
//                     user: user,
//                     mail: mail
//                 });
//             } else {
//                 let newUser = new User({
//                     email: email,
//                     password: password
//                 });
//                 User.createUser(newUser, function(err, user) {
//                     if (err) throw err;
//                     console.log(user);
//                 });
//                 req.flash('success_msg', 'You are registered and can now login');
//                 res.redirect('/user/login');
//             }
//         });
//     });
// }