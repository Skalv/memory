// On charge nos models
const models = require("../models");

// Récupération du module Router d'express pour créer nos routes.
const express = require('express');
const router = express.Router();

// Route GET /api/games
// On renvois toutes les Games présentent en BDD
router.get('/', function(req, res) {
    models.Games.findAll()
    .then((games) => {
        res.json(games)
    })
});

// Route POST /api/games
// Quand on envois le score d'une Game
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