import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import PlayingCard from './PlayingCard/PlayingCard';

export default function Gameboard (props) {
/* API */
    function getGameboardLayout() {
        let roomName = window.sessionStorage.getItem('roomName');
        window.socket.emit('getGameboardLayout', roomName, (gameboardLayout) => {
            console.log(gameboardLayout)
            setGameboardLaout(gameboardLayout);
        })
    }

    function getGameboard() {
        let roomName = window.sessionStorage.getItem('roomName');
        window.socket.emit('getGameboard', roomName, (gameboard, winner) => {
            console.log(gameboard)
            setGameboard(gameboard);
            if (winner !== null) { setWinner(winner); }
        })
    }
    
/* Variables */
    let gameboardInit = Array(10).fill('').map(x => Array(10).fill(''));
    const [gameboardLayout, setGameboardLaout] = useState(gameboardInit);
    const [gameboard, setGameboard] = useState(gameboardInit);
    const [winner, setWinner] = useState(null);
    
    let teamName = window.sessionStorage.getItem('teamName');
    let winnerText = '';
    if (winner === teamName) { winnerText = 'You Win!'; }
    else if (winner === 'cat') { winnerText = '🐈'; }
    else if (winner !== null) { winnerText = 'You Lose :('; }
    
/* Functions */
    useEffect(() => {
        getGameboardLayout();
        getGameboard();
    
        window.socket.on('updateGameboard', () => { getGameboard(); });
    
        return () => {  // Teardown function
            window.socket.off('updateGameboard');
        };
    }, []); // Initializes because of empty array dependency
    
    function placePiece(rowIndex, colIndex) {
        let teamName = window.sessionStorage.getItem('teamName');
        let roomName = window.sessionStorage.getItem('roomName');
    
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
        {gameboardLayout.map(function (row, rowIndex) {
            return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 1 }}>{row.map(function(item, colIndex) {
                return <PlayingCard rank_suit={item} boardValue={gameboard[rowIndex][colIndex]} onClick={() => placePiece(rowIndex, colIndex)} />
            })}</Box>
        })}
    </Box>;

    let returnButton = <Button sx={{ margin: 1 }} variant='contained' size='small' onClick={() => returnToLobbies()}><Typography sx={{ fontFamily: 'Monospace'}}>{'Return to Lobbies'}</Typography></Button>;
    
    gameboardJSX = (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <Typography sx={{ fontFamily: 'Monospace', fontSize: '2em' }}>{winnerText}</Typography>
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