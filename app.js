var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var index = require('./routes/index');

var app = express();


// view engine setup
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' })); // specify extension of files and default layout folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

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


// Sequelize
const Sequelize = require('sequelize');

// Information for sequelize to connect to database
const connection = new Sequelize('blessed', 'blessed', 'mvfDB918', {
    host: 'localhost',
    dialect: 'postgres'
});

// create and define model using your connection information
// model takes two arguments - the name of the model and an object representing its properties
let Article = connection.define('article', {
    // the value of each property must be the data type it represents
    slug: {
        type: Sequelize.STRING,
        // tell sequelize to not autogenerate an id
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        defaultValue: 'Coming Soon...'
    }
}, {
    // disable timestamps option
    timestamps: false
});

// Synchronize database by calling the sync function on the connection object
// connection.sync().then(function() {
//     // insert new record into our table 
//     Article.create({
//         title: 'My First Article',
//         body: 'This is going to be our first post using a Relational Database (posgres). We are using Sequelize as our ORM'
//     });
// });


// retrieving a record from our database using its id when you have it
// connection.sync().then(function() {
//     Article.findById(6).then(function(article) {
//         console.log(article.dataValues);
//     })
// });

// retrieving all records from the database when you don't have an id
connection.sync({
    // delete all database entry
    // force: true,
    logging: console.log
}).then(function() {
    // Article.findAll().then(function(articles) {
    //     console.log(articles.length);
    // })
});