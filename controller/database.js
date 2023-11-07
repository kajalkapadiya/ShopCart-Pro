const Sequelize = require('sequelize');

// database, username, pass, options
const sequelize = new Sequelize('nodejs.tut', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
})

module.exports = sequelize;