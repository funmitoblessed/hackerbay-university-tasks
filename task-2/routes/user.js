const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

// Get user model
const User = require('../models/user');

// Render User Signup
router.get('/signup', function(req, res) {
    res.render('signup');
});

// Render User Login
router.get('/login', function(req, res) {
    res.render('login');
});

// Register new User 
router.post('/signup', (req, res) => {
    let newUser = {
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
    };


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
        console.log('NO errors so far', newUser);
    }




    // COMMENT OUT FOR NOW
    // User.findOne({ where: { email: newUser.email } })
    //     .then(user => {
    //         if (user) return res.status(400).json({ error: 'User already exists' })
    //         else {
    //             User.create(newUser)
    //                 .then(user => {
    //                     let payload = {
    //                         email: user.email,
    //                         password: user.password
    //                     };
    //                     jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
    //                         res.json({ session: token })
    //                     });
    //                 })
    //         }
    //     })
    //     .catch(err => res.status(401).json(err));
    //COMMENT OUT FOR NOW


});

// Login API
router.post('/login', (req, res) => {
    let newUser = {
        email: req.body.email,
        password: req.body.password
    }

    User.findOne({ where: { email: newUser.email } })
        .then(user => {
            if (user) {
                bcrypt.compareSync(newUser.password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            let payload = { email: user.email, password: user.password }
                            jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
                                res.json({ session: token })
                            })
                        } else {
                            res.status(401).json({ error: 'Wrong Password' })
                        }
                    })
            } else {
                res.status(404).json({ error: 'User does not exist.' })
            }
        })
        .catch(err => res.status(401).json(err));
})

// Passport
passport.use(new LocalStrategy(
    function(email, password, done) {
        User.createUser = function(newUser, callback) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    newUser.password = hash;
                    newUser.save(callback);
                });
            });
        }
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



module.exports = router;