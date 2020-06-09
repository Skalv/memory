module.exports = (sequelize, DataTypes) => {
    class Game extends sequelize.Sequelize.Model {}

    Game.init({
        pseudo: DataTypes.STRING,
        score: DataTypes.STRING
    }, { sequelize });

    Game.sync({force: true});

    return Game;
};
