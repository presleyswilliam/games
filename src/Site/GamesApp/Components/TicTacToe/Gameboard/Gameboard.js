import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";

export default function Gameboard (props) {
/* API */
function getGameState() {
    let roomName = window.sessionStorage.getItem('roomName');
    let params = { 'roomName': roomName };
    window.socket.emit('getGameState', params, (gameState) => {
        setGameboard(gameState.gameboard);
        setTurn(gameState.turn);
        if (gameState.winner !== null) { setWinner(gameState.winner); }
    })
}

/* Variables */
const [gameboard, setGameboard] = useState([['', '', ''],['', '', ''],['', '', '']]);
const [turn, setTurn] = useState('');
const [winner, setWinner] = useState(null);

let teamName = window.sessionStorage.getItem('teamName');
let gameStatusText = '';
if (winner === teamName) { gameStatusText = 'You Win!'; }
else if (winner === 'cat') { gameStatusText = '🐈'; }
else if (winner !== null) { gameStatusText = 'You Lose :('; }
else if (winner === null && turn === teamName) { gameStatusText = 'Your Turn'; }
else if (winner === null && turn !== teamName) { gameStatusText = `Opponent's Turn`; }

/* Functions */
useEffect(() => {
    getGameState();

    window.socket.on('updateGameboard', () => { getGameState(); });

    return () => {  // Teardown function
        window.socket.off('updateGameboard');
    };
}, []); // Initializes because of empty array dependency

function placePiece(rowIndex, colIndex) {
    let teamName = window.sessionStorage.getItem('teamName');
    let roomName = window.sessionStorage.getItem('roomName');
    
    /* Validation */
    if (turn !== teamName) { /*alert('Wait your turn.');*/ return; }

    let coord = [rowIndex, colIndex];

    window.socket.emit('placePiece', roomName, teamName, coord);
}

function returnToLobbies() {
    let roomName = window.sessionStorage.getItem('roomName');
    let teamName = window.sessionStorage.getItem('teamName');
    window.socket.emit('leaveGame', roomName, teamName);

    window.sessionStorage.removeItem('roomName');
    window.sessionStorage.removeItem('teamName');

    props.setGameName('');
}

/* CSS Classes */


/* JSX */
    let gameboardJSX;
    
    let board = <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {gameboard.map(function (row, rowIndex) {
            return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>{row.map(function(item, colIndex) {
                return <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 100, height: 100, margin: 0.5, backgroundColor: item == '' ? 'lightgrey' : item == teamName ? 'lightgreen' : 'red', cursor: 'pointer' }} onClick={() => placePiece(rowIndex, colIndex)}></Card>
            })}</Box>
        })}
    </Box>;

    let returnButton = <Button sx={{ margin: 1 }} variant='contained' size='small' onClick={() => returnToLobbies()}><Typography sx={{ fontFamily: 'Monospace'}}>{'Return to Lobbies'}</Typography></Button>;

    gameboardJSX = (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <Typography sx={{ fontFamily: 'Monospace', fontSize: '2em' }}>{gameStatusText}</Typography>
            {board}
            {winner !== null ? returnButton : <React.Fragment></React.Fragment>}
        </Box>
    );

    return (
        <React.Fragment>
            {gameboardJSX}
        </React.Fragment>
    );
}