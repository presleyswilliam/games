import React, { useState } from "react";
import Button from '@mui/material/Button';

export default function ActiveGameCard (props) {
/* API */
function startGame(gameType, roomName) {
    window.socket.emit('startGame', gameType, roomName, (gameType, roomName) => {
        console.log(`Success! Started game of ${gameType} in room ${roomName}.`)
    })
}

function joinGame(roomName) {
    window.socket.emit('joinGame', roomName, (roomName) => {
        window.sessionStorage.setItem('roomName', roomName);
        console.log(`Success! Joined room ${roomName}.`)
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
    let startJoinButton;
    if (props.joined) {
        startJoinButton = <React.Fragment><br/><Button variant='contained' size='small' onClick={() => startGame(props.gameType, props.name)}>Start</Button></React.Fragment>;
    } else {
        startJoinButton = <React.Fragment><br/><Button variant='contained' size='small' onClick={() => joinGame(props.name)}>Join</Button></React.Fragment>;
    }

    gameCardJSX = <div style={{...gameCard()}}>{title}<br/>{gameType}<br/>{`(${numJoined})`}{startJoinButton}</div>;

    return (
        <React.Fragment>
            {gameCardJSX}
        </React.Fragment>
    );
}