const models = require("../models");
const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    models.Games.findAll()
    .then((games) => {
        res.json(games)
    })
});

router.post('/', function(req, res) {
    models.Games.create({
        pseudo: req.body.pseudo,
        score: req.body.score
    }).then((game) => {
        res.json(game)
    })
});

module.exports = router;