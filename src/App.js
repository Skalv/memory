import React, {Suspense} from 'react';
import './App.scss';

/*
React.Lazy() et Suspense permettent de charger dynamiquement nos composants (que si on en a besoin)
https://reactjs.org/docs/code-splitting.html#reactlazy
 */
const Welcome = React.lazy(() => import('./components/Welcome'));
const Game = React.lazy(() => import('./components/Game'));

/**
 * Class principale de notre application
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this); // bind nous permet d'accèder au contexte (App) dans la fonction handleSubmit
        this.state = {
            inGame: false, // Permet d'afficher la page de connexion en premier.
            pseudo: "" // Pseudo du joueur
        }
    }

    /*
    Quand on valide le pseudo on passe au jeu
     */
    handleSubmit(pseudo) {
        this.setState({
            pseudo: pseudo,
            inGame: true
        })
    }

    /*
    Affiche en premier la page de connexion.
    Une fois le pseudo validé on passe à la page de jeu.
    Les balises Suspense permettent de charger les composants avec LazyLoad,
    le fallback est affiché pendant le chargement du composant
     */
    render() {
        if (this.state.inGame) {
            return (
                <Suspense fallback={<div>Chargement...</div>}>
                    <Game pseudo={this.state.pseudo} />
                </Suspense>
            )
        } else {
            return (
                <Suspense fallback={<div>Chargement...</div>}>
                    <Welcome handleSubmit={this.handleSubmit}/>
                </Suspense>
            )
        }
    }
}

export default App;
