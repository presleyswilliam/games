import React, { useState } from "react";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";

export default function ActiveGameCard (props) {
/* API */
function startGame(gameType, roomName) {
    window.socket.emit('startGame', gameType, roomName, (gameType, roomName) => {
        console.log(`Success! Started game of ${gameType} in room ${roomName}.`)
    })
}

function joinGame(roomName) {
    let teamName = window.sessionStorage.getItem('teamName');
    window.socket.emit('joinGame', roomName, teamName, (roomName) => {
        window.sessionStorage.setItem('roomName', roomName);
        console.log(`Success! Joined room ${roomName}.`)
    })
}
    

/* Variables */

    
/* Functions */


/* CSS Classes */
    let card = () => ({
        backgroundColor: props.joined ? 'lightgreen' : 'lightgray'
    });


/* JSX */
    let gameCardJSX;
    let title = props.name;
    let numJoined = props.numJoined;
    let maxPlayers = props.maxPlayers;
    let gameType = props.gameType;
    let startJoinButton;
    if (props.joined) {
        startJoinButton = <Button variant='contained' size='small' disabled={!props.canStart} onClick={() => startGame(props.gameType, props.name)}>Start</Button>;
    } else {
        startJoinButton = <Button variant='contained' size='small' disabled={!props.canJoin} onClick={() => joinGame(props.name)}>Join</Button>;
    }

    gameCardJSX = (
        <Card sx={{ width: 200, borderRadius: '0.5em', margin: 1 }} style={{ ...card() }}>
            <CardContent>
                <Typography>{title}</Typography>
                <Typography sx={{ fontFamily: 'Monospace'}}>{`${gameType} (${numJoined}/${maxPlayers})`}</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
                <Typography>{startJoinButton}</Typography>
            </CardActions>
        </Card>
    );

    return (
        <React.Fragment>
            {gameCardJSX}
        </React.Fragment>
    );
}