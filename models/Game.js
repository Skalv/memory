// Retourne le Schema de notre Model Game
// Notre table games contient deux champs : pseudo et score
// Sequilize ajoute seul les champs id, created_at et update_at

// La fonction sync permet de créer la BDD si elle n'existe pas.
module.exports = (sequelize, DataTypes) => {
    class Game extends sequelize.Sequelize.Model {}

    Game.init({
        pseudo: DataTypes.STRING,
        score: DataTypes.STRING
    }, { sequelize });

    Game.sync({force: true});

    return Game;
};
