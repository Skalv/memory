import React from "react";

function MessageBanner (props) {
    if (!props.win && !props.timeover) {
        return null;
    }

    let msg;
    let score = null;
    if (props.win) {
        msg = "Gagné !";
        score = <p>Votre temps : {props.time} secondes</p>
    } else if (props.timeover) {
        msg = "Perdu !";
    }

    return (
        <div className="message-box">
            <div className="message-data">
                <h2>{msg}</h2>
                <p>{score}</p>
            </div>
        </div>
    )
}

export default MessageBanner;

