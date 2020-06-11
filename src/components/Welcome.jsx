import React from "react";
import axios from "axios";

/**
 * Le composant Welcome affiche le formulaire pour le pseudo et les scores précédents.
 * C'est la page d'accueil de notre jeu
 */
class Welcome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pseudo: "",
            games: []
        }
    }
    /*
    Pendant le montage du composant on appelle notre serveur
    afin qu'il nous retourne les scores des précédentes parties.
     */
    async componentDidMount() {
        let {data} = await axios.get('/api/games');

        this.setState({
            games: data
        })
    }

    /*
    Appelé lors du "submit" du formulaire cette fonction
    valide et renvoie du pseudo au composant supérieur App.
     */
    handleSubmit(e) {
        e.preventDefault();
        if (this.state.pseudo !== "") {
            this.props.handleSubmit(this.state.pseudo)
        }
    }
    /*
    Sauvegarde le pseudo quand on "tape" dans l'input.
     */
    handleChange(e) {
        this.setState({
            pseudo: e.target.value
        })
    }
    /*
    Affiche le formulaire pour le pseudo et l'historique des parties.
     */
    render() {
        /*
        Affiche une liste de parties ou un message si il n'y a pas de partie sauvegardée.
         */
        let historyList = (
            <p>Aucun historique :(</p>
        )
        if (this.state.games.length > 0) {
            historyList = (
                <ul>
                    {this.state.games.map((game, index) => {
                        return (
                            <li key={game.id}><b>{index + 1}. {game.pseudo}</b> - {game.score}s</li>
                        )
                    } )}
                </ul>
            );
        }

        return (
            <div id="Welcome">
                <div className="container">
                    <h1>Bienvenue sur Memory</h1>
                    <form onSubmit={(e) => {this.handleSubmit(e)}}>
                        <input id="pseudo"
                               type="text"
                               name="pseudo"
                               placeholder={"Pseudo"}
                               value={this.state.pseudo}
                               onChange={(e) => {this.handleChange(e)}}
                        />
                        <button type="submit">Jouer</button>
                    </form>
                    <h2>Meilleur scores</h2>
                    <div className="history">
                        {historyList}
                    </div>
                </div>
            </div>
        )
    }
}

export default Welcome;