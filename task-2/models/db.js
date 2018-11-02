const pg = require('pg'); // require postgres dependency
const Sequelize = require('sequelize');

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

module.exports = sequelize;