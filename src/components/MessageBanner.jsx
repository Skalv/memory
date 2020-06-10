import React from "react";

function MessageBanner (props) {
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
            </div>
        </div>
    )
}

export default MessageBanner;

