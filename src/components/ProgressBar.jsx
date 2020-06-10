import React from "react";

/**
 * Affiche la barre de progression
 *
 * @param props
 * @returns {*}
 * @constructor
 */
function ProgressBar(props) {
    return (
        <div>
            <div className="progress-bar">
                <div className="progress" style={props.style} />
            </div>
        </div>
    )
}

export default ProgressBar;