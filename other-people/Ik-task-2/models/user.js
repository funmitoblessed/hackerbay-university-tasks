const Sequelize = require('sequelize');
const connection = require('../db');
const bcrypt = require('bcryptjs');

const User = connection.define('userinfo', {
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
});
connection.sync();

User.beforeCreate((user, options) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(user.password, salt);
    return user.password = hash;
});


module.exports = User;