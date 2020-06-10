import React from "react";

/**
 * Affiche un item.
 * Quand on clique dessus il appel la fonction de retour onClick
 *
 * @param props
 * @returns {*}
 * @constructor
 */
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