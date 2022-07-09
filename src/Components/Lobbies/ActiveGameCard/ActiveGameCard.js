import React, { useState } from "react";

export default function ActiveGameCard (props) {
/* API */
function startGame(gameType, roomName) {
    window.socket.emit('startGame', gameType, roomName, (response) => {
        console.log(response)
    })
}
    

/* Variables */

    
/* Functions */


/* CSS Classes */
    let gameCard = () => ({
        display: 'inline-block',
        height: '6em',
        width: '10em',
        borderRadius: '0.5em',
        margin: '1em',
        backgroundColor: props.joined ? 'lightgreen' : 'lightgray'
    });


/* JSX */
    let gameCardJSX;
    let title = props.name;
    let numJoined = props.numJoined;
    let gameType = props.gameType;
    let startGameButton = <React.Fragment></React.Fragment>;
    if (props.joined) {
       startGameButton = <React.Fragment><br/><button onClick={() => startGame(props.gameType, props.name)}>Start</button></React.Fragment>;
    }

    gameCardJSX = <div style={{...gameCard()}}><br/>{title}<br/>{gameType}<br/>{`(${numJoined})`}{startGameButton}</div>;

    return (
        <React.Fragment>
            {gameCardJSX}
        </React.Fragment>
    );
}