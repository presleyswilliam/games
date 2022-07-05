import React, { useState } from "react";

export default function ActiveGameCard (props) {
/* API */
    

/* Variables */

    
/* Functions */


/* CSS Classes */
    let gameCard = () => ({
        display: 'inline-block',
        height: '6em',
        width: '10em',
        borderRadius: '0.5em',
        margin: '1em',
        backgroundColor: 'lightgray'
    });


/* JSX */
    let gameCardJSX;
    let title = props.name;
    let numJoined = props.numJoined;

    gameCardJSX = <div style={{...gameCard()}}><br/>{title}<br/><br/>Game_Type<br/>{numJoined}</div>;

    return (
        <React.Fragment>
            {gameCardJSX}
        </React.Fragment>
    );
}