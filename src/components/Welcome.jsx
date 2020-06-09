import React from "react";
import axios from "axios";

class Welcome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pseudo: "",
            games: []
        }
    }

    async componentDidMount() {
        let {data} = await axios.get('/api/games');

        this.setState({
            games: data
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.pseudo !== "") {
            this.props.handleSubmit(this.state.pseudo)
        }
    }

    handleChange(e) {
        this.setState({
            pseudo: e.target.value
        })
    }

    render() {
        let historyList = (
            <p>Aucun résultat</p>
        )
        if (this.state.games.length > 0) {
            historyList = (
                <ul>
                    {this.state.games.map((game) => {
                        return (
                            <li key={game.id}><b>{game.score}s</b> - {game.pseudo}</li>
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