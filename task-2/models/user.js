const pg = require('pg'); // require postgres dependency
const Sequelize = require('sequelize');
let bcrypt = require('bcryptjs');

// Connection for postgres
const connect = process.env.DATABASE_URL || 'postgres://localhost:5432/postgres';
// Instantiate Client for postgres database
const client = new pg.Client(connect);
// Connect to the client
client.connect();

// define new Sequelize connection
const sequelize = new Sequelize({
    database: 'postgres',
    username: 'blessed',
    password: null,
    host: 'localhost',
    dialect: 'postgres'
});

//  create models (table) in database for storing user info
let User = sequelize.define('user', {
    // the value of each property must be the data type it represents
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING
    }
}, {
    // disable timestamps option
    timestamps: false
});

// Create associated tables to defined model
sequelize.sync();



// User functions
module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByEmail = function(email, callback) {
    let query = { email: email };
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports = sequelize;