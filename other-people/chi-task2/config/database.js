const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = {
    sequelize: new Sequelize("postgres", "blessed", null, {
        host: "localhost",
        dialect: "postgres",
        secret: "newpassword",
        operatorsAliases: Op
    })
}