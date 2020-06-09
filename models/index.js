const Sequelize = require('sequelize');
const path = require('path');
var db = {};

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, '..', 'storage', 'database.sqlite')
});

db['Games'] = sequelize.import('./Game');

db.sequelize = sequelize;
db.Sequilize = Sequelize;

module.exports = db;

