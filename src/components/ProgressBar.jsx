import React from "react";

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