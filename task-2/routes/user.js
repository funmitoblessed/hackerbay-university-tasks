const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    }

    User.findOne({ where: { email: newUser.email } })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'User already exists' })
            else {
                User.create(newUser)
                    .then(user => {
                        let payload = {
                            email: user.email,
                            password: user.password
                        };
                        jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
                            res.json({ session: token })
                        });
                    })
            }
        })
        .catch(err => res.status(401).json(err));
});

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





module.exports = router;