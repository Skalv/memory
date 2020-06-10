import React from "react";

function Square(props) {
    return (
        <div
            className={(props.fruit.found)? "item visible" : "item hidden"}
            onClick={() => {props.onClick()}}
            style={props.fruit.style}
        />
    )
}

export default Square;