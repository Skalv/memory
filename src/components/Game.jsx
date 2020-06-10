import React, {Suspense} from "react";
import axios from "axios";
const _ = require('lodash');

const MessageBanner = React.lazy(() => import('./MessageBanner'));
const ProgressBar = React.lazy(() => import('./ProgressBar'));
const Square = React.lazy(() => import('./Square'));

function initItems () {
    // On prend 14 des 18 items
    let selectedItems = [];
    while (selectedItems.length < 14) {
        let id = (Math.floor(Math.random() * (18 - 1) + 1)) * 100;
        if (selectedItems.indexOf(id) === -1) {
            selectedItems.push(id);
        }
    }
    let items = selectedItems.concat(selectedItems);

    return _.shuffle(items.map((id, index) => {
        return {
            key: `${id}-${index}`,
            id: id,
            style: { backgroundPositionY: -id },
            found: false
        };
    }));
}

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

    /**
     * handleClick est appelé à chaque fois que l'on clique sur une carte.
     * Dans un premier temps il affiche le fruit sur lequel on a cliqué, grâce au booléen "found".
     * Dans un second temps on analyse la carte.
     *
     * Lors du premier clique, on sauvegarde le fruit que se trouve sur la carte.
     * Lors du second clique, on compare les deux fruits :
     * - C'est les mêmes on les laisses donc visible et on test la condition de victoire.
     * - Ce n'est pas les mêmes, on attends 1,5 secondes (1500ms) et on les cachent.
     */
    async handleClick(clickedItem) {
        if (
            this.state.pending // On ne peu pas recliquer avant que les deux secondes soient passées.
            || this.state.timeOver // Désactive quand le temps est écoulé.
            || (this.state.firstClick && this.state.firstClick.key === clickedItem.key) // Désactive le double click
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

    componentDidMount() {
        this.startTimer();
    }

    startTimer() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    async isWin() {
        this.setState({
            isWin: true
        });
        clearInterval(this.timerID);
        let {data} = await axios.post('/api/games', {
            pseudo: this.props.pseudo,
            score: this.state.progress.current
        });

    }

    tick() {
        let newTime = this.state.progress.current;
        newTime++;
        const percent = Math.floor((newTime / this.state.progress.total) * 100);
        this.setState({
            progress: {
                ...this.state.progress,
                current: newTime,
                style: { width: `${percent}%` }
            }
        });

        if (newTime === this.state.progress.total) {
            clearInterval(this.timerID);
            this.setState({
                timeover: true
            })
        }
    }

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

    render() {
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
                        <MessageBanner
                            win={this.state.isWin}
                            timeover={this.state.timeover}
                            time={this.state.progress.current}
                            onClick={() => {this.reset()}}
                        />
                    </div>
                    <ProgressBar style={this.state.progress.style} />
                </Suspense>
            </div>
        );
    }
}

export default Game;