const Sequelize = require('sequelize');

// Ik's local database
// const connection = new Sequelize('hackerbay', 'postgres', 'C00ljoe.', {
//     host: 'localhost',
//     dialect: 'postgres',
//     operatorsAliases: false,

//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });

// Changing the above details to my local database
const connection = new Sequelize('postgres', 'blessed', null, {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = connection;