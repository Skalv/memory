// On charge nos Models
const models = require("../models");

// Récupération du module Router d'express pour créer nos routes.
const express = require('express');
const router = express.Router();

// Route GET /api/games
// On renvoie toutes les Games présentes en BDD
router.get('/', function(req, res) {
    models.Games.findAll({
        order: models.sequelize.col('score'),
        limit: 10
    })
    .then((games) => {
        res.json(games)
    })
});

// Route POST /api/games
// Quand on envoie le score d'une Game
// on l'enregistre dans notre BDD et retourne la nouvelle entrée.
router.post('/', function(req, res) {
    models.Games.create({
        pseudo: req.body.pseudo,
        score: req.body.score
    }).then((game) => {
        res.json(game)
    })
});

module.exports = router;