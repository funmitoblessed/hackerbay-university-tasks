const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User model
const User = require('../models/user');

router.post('/signup', (req, res) => {
    let newUser = {
        email: req.body.email,
        password: req.body.password
    }

    User.findOne({ where: { email: newUser.email } })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'Email already exists' })
            else {
                User.create(newUser)
                    .then(user => {
                        let payload = {
                            email: user.email
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
                            let payload = { email: user.email }
                            jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
                                res.json({ session: token })
                            })
                        } else {
                            res.status(401).json({ error: 'Invalid Password' })
                        }
                    })
            } else {
                res.status(404).json({ error: 'User does not exist.' })
            }
        })
        .catch(err => res.status(401).json(err));
})

module.exports = router;