var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('blessed', 'blessed', 'mvfDB918', {
    host: 'localhost',
    dialect: 'postgres'
});

// create and define model
// model takes two arguments - the name of the model and an object representing its properties
var Article = sequelize.define('article', {
    title: Sequelize.STRING,
    body: Sequelize.TEXT
});

// synchronizes model and database
sequelize.sync().then(function() {
    Article.create({ // insert new record into our table using create
        title: 'demo',
        body: 'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.'
    });
});

// retrieve a particular record using its id
sequelize.sync().then(function() {
    Article.findById(2).then(function(article) {
        console.log(article.dataValues);
    });
});



// mongoose.connect('mongodb://localhost/hbusimpleloginapp', { useNewUrlParser: true });
// var db = mongoose.connection;

var routes = require('./routes/index');
var user = require('./routes/user');

var app = express();

// // view engine setup
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' })); // specify extension of files and default layout folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global variables for flash messages
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


app.use('/', routes);
app.use('/user', user);

app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;