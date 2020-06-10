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
        }
    }

    async handleClick(clickedItem) {
        if (
            this.state.pending // On ne peu pas recliquer avant que les deux secondes soient passées.
            || this.state.timeOver // Désactive quand le temps est écoulé.
            || (this.state.firstClick && this.state.firstClick.key === clickedItem.key) // Désactive le double click
        ) {
            return;
        }
        let firstClick = this.state.firstClick;
        let items = this.state.items.map((currentItem) => {
            if (currentItem.key === clickedItem.key) {
                currentItem.found = true
            }
            return currentItem;
        });

        this.setState({
            items: items,
            pending: true
        });

        if (firstClick) {
            if (firstClick.id === clickedItem.id && firstClick.key !== clickedItem.key) {
                if (!_.find(this.state.items, ['found', false])) {
                    this.isWin();
                }
            } else {
                await new Promise(r => setTimeout(r, 1500));
                items = this.state.items.map((currentItem) => {
                    if (currentItem.key === firstClick.key || currentItem.key === clickedItem.key) {
                        currentItem.found = false
                    }
                    return currentItem;
                });
            }
            firstClick = null;
        } else {
            firstClick = clickedItem;
        }

        this.setState({
            firstClick: firstClick,
            items: items,
            pending: false
        });
    };

    componentDidMount() {
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
                        />
                    </div>
                    <ProgressBar style={this.state.progress.style} />
                </Suspense>
            </div>
        );
    }
}

export default Game;