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
    window.socket.emit('joinGame', roomName, (roomName) => {
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
    let gameType = props.gameType;
    let startJoinButton;
    if (props.joined) {
        startJoinButton = <Button variant='contained' size='small' onClick={() => startGame(props.gameType, props.name)}>Start</Button>;
    } else {
        startJoinButton = <Button variant='contained' size='small' onClick={() => joinGame(props.name)}>Join</Button>;
    }

    gameCardJSX = (
        <Card sx={{ width: 200, borderRadius: '0.5em', margin: 1 }} style={{ ...card() }}>
            <CardContent>
                <Typography>{title}</Typography>
                <Typography>{gameType}</Typography>
                <Typography>{`(${numJoined})`}</Typography>
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