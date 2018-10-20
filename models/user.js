let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

// User Schema
let UserSchema = mongoose.Schema({
    password: {
        type: String
    },
    email: {
        type: String
    }
});

// model
let User = module.exports = mongoose.model('User', UserSchema);

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