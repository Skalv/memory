// Sequelize est un ORM (Object Relational mapping)
// Il nous permet de simplifier la communication avec notre BDD
// Plus besoin de taper du SQL directement
// Il gère la connexion, les requêtes et ajoute une notion de Schema/Model
const Sequelize = require('sequelize');

const path = require('path');
var db = {};

// Connexion à la BDD
// Ici sqlite3 est utilisé, c'est une base de donnée fichier
// c'est à dire que les données sont stockées dans un dossier définit
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, '..', 'storage', 'database.sqlite') // Les données se trouve dans le dossier storage
});

// Import du Schema de notre Model Game
db['Games'] = sequelize.import('./Game');

// Permet de sauvegarder dans notre objet db
// Sequelize qui est le module et sequilize qui est notre instance connecté à notre BDD
db.sequelize = sequelize;
db.Sequilize = Sequelize;

module.exports = db;