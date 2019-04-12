// OLD CODE for routes/user

// User Signup
router.get('/signup', function(req, res) {
    res.render('signup');
});


// Login
router.get('/login', function(req, res) {
    res.render('login');
});


// Register User
router.post('/signup', (req, res) => {
    let newUser = {
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
    }
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
        User.findOne({ where: { email: newUser.email } })
            .then(user => {
                if (user) return res.status(400).json({ msg: 'Email already exists' })
                else {
                    let newUser = {
                        email: req.body.email,
                        password: req.body.password

                    }
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
    }


});



// Login

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
                            res.status(401).json({ error: 'Invalid Password' })
                        }
                    })
            } else {
                res.status(404).json({ error: 'User does not exist.' })
            }
        })
        .catch(err => res.status(401).json(err));
})

// Old signup post
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




if (errors) {
    res.render('signup', {
        errors: errors
    });
} else {
    //checking for email and username are already taken
    User.findOne({
        email: {
            "$regex": "^" + email + "\\b",
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
            }
        });
    });
}

// Passport
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