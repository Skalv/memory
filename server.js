/**
 * Serveur NodeJS avec ExpressJS
 */
const express = require('express');
const path = require('path');
const app = express();

// BodyParser est un middleware qui permet de retrouver
// facilement les données envoyées par les formulaires
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Chargement des routes de notre serveur.
// Ces routes répondront à l'adresse /api/games
const games = require('./routes/games');
app.use('/api/games', games);

// Définition des statics (css / js / images)
app.use(express.static(path.join(__dirname, 'build')));

// Sur l'adresse "/" on renvoie l'index.html de notre dossier build
// ce qui correspond à notre application React.
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

// Démarrage du serveur sur localhost:8000
app.listen(8000);