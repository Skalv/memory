import React, {Suspense} from "react";
import axios from "axios";
const _ = require('lodash');

/*
React.Lazy() et Suspense permettent de rendre dynamiquement nos composants (que si on en a besoin)
https://reactjs.org/docs/code-splitting.html#reactlazy
 */
const MessageBanner = React.lazy(() => import('./MessageBanner'));
const ProgressBar = React.lazy(() => import('./ProgressBar'));
const Square = React.lazy(() => import('./Square'));

/*
Au début d'une partie on appel la fonction initItems
qui permet de générer la liste des fruits à trouver
 */
function initItems () {
    // On prend, au hasard, 14 des 18 fruits
    let selectedItems = [];
    while (selectedItems.length < 14) { // "Tant que" nous n'avons pas 14 fruits on itère
        let id = (Math.floor(Math.random() * (18 - 1) + 1)) * 100; // Random entre 1 et 18
        if (selectedItems.indexOf(id) === -1) { // Si ce fruit n'est pas déjà dans la liste
            selectedItems.push(id); // On le prend
        }
    }
    // On double notre liste (pour avoir des pairs)
    let items = selectedItems.concat(selectedItems);
    // On mélange nos fruits et on créé des "objets"
    return _.shuffle(items.map((id, index) => {
        return {
            key: `${id}-${index}`, // Clé unique par items
            id: id, // Clé unique par pair de fruits
            style: { backgroundPositionY: -id }, // utilisation d'un sprite CSS pour afficher le fruit.
            found: false // Si found => visible sinon => hidden
        };
    }));
}

/**
 * Composant de jeu
 * Il affiche la grille avec les fruits.
 * Gère les méchanismes du jeu.
 * Gère le timer.
 */
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: initItems(),
            firstClick: null,
            pending: false,
            isWin: false,
            timeover: false,
            progress: {
                current: 0,
                total: 120,
                style: { width: 0 }
            }
        };
    }

    /*
    HandleClick est appelé à chaque fois que l'on clique sur une carte.
    Dans un premier temps il affiche le fruit sur lequel on a cliqué, grâce au booléen "found".
    Dans un second temps on analyse la carte.

    Lors du premier clique, on sauvegarde le fruit que se trouve sur la carte.
    Lors du second clique, on compare les deux fruits :
        - C'est les mêmes on les laisses donc visible et on test la condition de victoire.
        - Ce n'est pas les mêmes, on attends 1,5 secondes (1500ms) et on les cachent.
     */
    async handleClick(clickedItem) {
        if (
            this.state.pending // On ne peu pas recliquer avant que les deux secondes soient passées.
            || this.state.timeOver // Désactive quand le temps est écoulé.
            || (this.state.firstClick && this.state.firstClick.key === clickedItem.key) // Désactive le double click
            || clickedItem.found // Le fruit est déjà découvert (missclick)
        ) {
            return;
        }

        let firstClick = this.state.firstClick; // On récup la première carte retournée.
        let items = this.state.items.map((currentItem) => {
            // On itère sur chaque carte, afin de rendre visible c'elle qui est cliquée.
            if (currentItem.key === clickedItem.key) {
                currentItem.found = true
            }
            return currentItem;
        });
        // On sauvegarde notre état (permet de rendre visible nos cartes cliquées)
        this.setState({
            items: items,
            pending: true
        });
        // Si firstClick n'est pas null, c'est que l'on vien de cliquer sur la seconde carte.
        if (firstClick) {
            // Si les deux cartes retournées sont identiques.
            if (firstClick.id === clickedItem.id && firstClick.key !== clickedItem.key) {
                // On test si il y a encore des cartes non trouvées dans notre tableau.
                if (!_.find(this.state.items, ['found', false])) {
                    // Si plus de carte, la partie est gagnée.
                    this.isWin();

                    // Ici il ne se passe rien d'autre, les deux cartes sont déjà retournées, on les laissent donc
                    // dans cet état.
                }
            } else { // Les deux cartes ne sont pas identiques
                // On attend 1,5 secondes avant de retourner les deux cartes.
                await new Promise(r => setTimeout(r, 1500));
                items = this.state.items.map((currentItem) => {
                    if (currentItem.key === firstClick.key || currentItem.key === clickedItem.key) {
                        currentItem.found = false
                    }
                    return currentItem;
                });
            }
            firstClick = null; // On reset la première carte.
        } else { // Première carte => on la sauvegarde.
            firstClick = clickedItem;
        }

        // On sauvegarde notre état ce qui provoque un rechargement de notre grille.
        this.setState({
            firstClick: firstClick,
            items: items,
            pending: false
        });
    };

    /*
    Quand le composant est monté, on démarre le timer
     */
    componentDidMount() {
        this.startTimer();
    }

    /*
    Permet de démarrer un timer qui appel la fonction tick toutes les secondes
     */
    startTimer() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    /*
    Fonction de victoire.
    On affiche le message de victoire.
    On stop le timer
    On envois le score au serveur.
     */
    async isWin() {
        this.setState({
            isWin: true
        });
        clearInterval(this.timerID);
        await axios.post('/api/games', {
            pseudo: this.props.pseudo,
            score: this.state.progress.current
        });
    }

    /*
    Cette fonction permet d'avoir un temps maximum pour essayé de gagner (120 seconde)
    Elle met à jours la barre de progression et fait afficher le message "perdu" quand le temps
    est écoulé.
     */
    tick() {
        let newTime = this.state.progress.current;
        newTime++; // seconde++
        const percent = Math.floor((newTime / this.state.progress.total) * 100); // avancement de la barre de progression en %
        this.setState({
            progress: {
                ...this.state.progress,
                current: newTime,
                style: { width: `${percent}%` }
            }
        });
        // Si le temps est écoulé, on affiche perdu !
        if (newTime === this.state.progress.total) {
            clearInterval(this.timerID);
            this.setState({
                timeover: true
            })
        }
    }

    /*
    Permet de rejouer en repassant tous les paramètre du jeu à 0 et en rénitialisant la grille.
    Redémarre aussi le timer
     */
    reset() {
        this.setState({
            items: initItems(),
            firstClick: null,
            pending: false,
            isWin: false,
            timeover: false,
            progress: {
                ...this.state.progress,
                current: 0,
                style: { width: 0 }
            }
        });
        this.startTimer();
    }

    /*
    Affiche la grille du jeu.
     */
    render() {
        // On génére un tableau avec chaque élément contenant un fruit
        // Le click sur un élément appel la fonction handleClick
        const squares = this.state.items.map((item) => {
            return (
                <Square
                    key={item.key}
                    fruit={item}
                    onClick={() => {this.handleClick(item)}}
                />
            );
        });

        return (
            <div id="Game">
                <h1>Jeux de mémoire</h1>
                <h2>{this.props.pseudo} c'est à vous !</h2>
                <Suspense fallback={<div>Chargement...</div>}>
                    <div className="container">
                        {/*Affichage de la grille de jeu*/}
                        {squares}
                        {/*Affichage du message de fin de partie, remonte aussi le reset*/}
                        <MessageBanner
                            win={this.state.isWin}
                            timeover={this.state.timeover}
                            time={this.state.progress.current}
                            onClick={() => {this.reset()}}
                        />
                    </div>
                    {/*Affichage de la barre de progression*/}
                    <ProgressBar style={this.state.progress.style} />
                </Suspense>
            </div>
        );
    }
}

export default Game;