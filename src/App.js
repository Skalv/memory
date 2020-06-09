import React, {Suspense} from 'react';
import './App.scss';

const Welcome = React.lazy(() => import('./components/Welcome'));
const Game = React.lazy(() => import('./components/Game'));

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            inGame: false,
            pseudo: ""
        }
    }

    handleSubmit(pseudo) {
        this.setState({
            pseudo: pseudo,
            inGame: true
        })
    }

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
