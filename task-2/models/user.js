const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../models/db');

//  create models (table) in database for storing user info
let User = sequelize.define('user', {
    // id: {
    //     type: Sequelize.UUID,
    //     primaryKey: true,
    //     defaultValue: Sequelize.UUIDV4
    // },
    // the value of each property must be the data type it represents
    email: {
        type: Sequelize.STRING,
        unique: true,
        // allowNull: false
    },
    password: {
        type: Sequelize.STRING
    }
}, {
    // disable timestamps option
    timestamps: true
});

// Create associated tables to defined model
// Does not update tables
// Only creates a table that does not already exist
sequelize
    .sync( // { force: true } // this object recreates the table each time it is called. USE WITH CAUTION!!!
    )
    .then(function() {

    })
    .catch(function(error) {
        console.log(error);
    });

// User functions
// User.beforeCreate((user, options) => {
//     let salt = bcrypt.genSaltSync(10);
//     let hash = bcrypt.hashSync(user.password, salt);
//     return user.password = hash;
// });

module.exports = User;


// Modules to Export
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