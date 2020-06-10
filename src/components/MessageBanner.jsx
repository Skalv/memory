import React from "react";

/**
 * Ce composant affiche le message de fin de partie (gagné ou perdu et le score)
 * Il permet aussi de rejouer ou de quitter (retour à Welcome)
 */

function MessageBanner (props) {
    // Ce composant est appelé à chaque instant.
    // Si la partie n'est pas terminé, on ne l'affiche pas.
    if (!props.win && !props.timeover) {
        return null;
    }

    let msg;
    let score = null;

    if (props.win) {
        msg = "Gagné !";
        score = `Votre temps : ${props.time} secondes`
    } else if (props.timeover) {
        msg = "Perdu !";
    }

    return (
        <div className="message-box">
            <div className="message-data">
                <h2>{msg}</h2>
                <p>{score}</p>
                <button onClick={props.onClick}>Rejouer</button>
                {/*On recharge la page pour retourner à Welcome*/}
                <button onClick={() => {window.location.reload()}}>Quitter</button>
            </div>
        </div>
    )
}

export default MessageBanner;

