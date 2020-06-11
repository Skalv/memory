#Jeu du Memory 

Ce jeu est développé avec [ReactJS](https://reactjs.org/) pour le front.<br/>
[NodeJS et expressJS](https://expressjs.com/fr/) pour le back.<br/>
Les données sont stockées par [Sqlite3](https://www.sqlite.org/index.html).<br/>
Pour le déploiement, [Docker](https://www.docker.com/) est déjà configuré avec [docker-compose](https://docs.docker.com/compose/).

##Déploiement sans Docker
[NodeJS (LTS)](https://nodejs.org/fr/) et [Yarn](https://yarnpkg.com/) sont requis.
Dans le répertoire du jeu :

### `yarn`
Télécharge les dépendances.

### `yarn build`
Build l'application pour la production.

### `node server.js`
Démarre le serveur.
Vous pouvez retrouver l'application à l'adresse http://localhost:8000

##Déploiement avec Docker
[Docker](https://www.docker.com/) et [docker-compose](https://docs.docker.com/compose/) sont requis.

Dans le répertoire du jeu :

## `docker-compose exec web yarn`
Télécharge les dépendances.

### `docker-compose exec web yarn build`
Build l'application pour la production.

### `docker-compose up -d`
Démarre le serveur.
Vous pouvez retrouver l'application à l'adresse http://localhost:8012<br/>
L'option `-d` permet de démarrer le container en arrière plan.