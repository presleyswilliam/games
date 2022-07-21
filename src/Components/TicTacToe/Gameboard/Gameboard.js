import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";

export default function Gameboard (props) {
/* API */
function getGameBoard() {
    let roomName = window.sessionStorage.getItem('roomName');
    window.socket.emit('getGameBoard', roomName, (gameboard, winner) => {
        setGameboard(gameboard);
        if (winner !== null) { setWinner(winner); }
    })
}

/* Variables */
const [gameboard, setGameboard] = useState([['', '', ''],['', '', ''],['', '', '']]);
const [winner, setWinner] = useState(null);
let teamName = window.sessionStorage.getItem('teamName');

/* Functions */
useEffect(() => {
    getGameBoard();

    window.socket.on('updateGameboard', () => { getGameBoard(); });

    return () => {  // Teardown function
        window.socket.off('updateGameboard');
    };
}, []); // Initializes because of empty array dependency

function placePiece(rowIndex, colIndex) {
    let teamName = window.sessionStorage.getItem('teamName');
    let roomName = window.sessionStorage.getItem('roomName');
    let coord = [rowIndex, colIndex];
    window.socket.emit('setPiece', roomName, teamName, coord, (response) => {
        // console.log(response)
    })
}

function returnToLobbies() {
    let teamName = window.sessionStorage.getItem('teamName');
    let roomName = window.sessionStorage.getItem('roomName');
    window.socket.emit('leaveGame', roomName, teamName, (response) => {
        // console.log(response)
    })
    props.setGameName('');
}

/* CSS Classes */


/* JSX */
    let gameboardJSX;
    // gameboardJSX = (<React.Fragment>
    // <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 1 }}><Card>1</Card><Card>2</Card><Card>3</Card></Box>
    // <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 1 }}><Card>4</Card><Card>5</Card><Card>6</Card></Box>
    // <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 1 }}><Card>7</Card><Card>8</Card><Card>9</Card></Box>
    // </React.Fragment>);
    let board = <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {gameboard.map(function (row, rowIndex) {
            return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 1 }}>{row.map(function(item, colIndex) {
                return <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 100, height: 100, margin: 0.5, backgroundColor: item == '' ? 'lightgrey' : item == teamName ? 'lightgreen' : 'red', cursor: 'pointer' }} onClick={() => placePiece(rowIndex, colIndex)}></Card>
            })}</Box>
        })}
    </Box>;
    let returnButton = <Button sx={{ margin: 1 }} variant='contained' size='small' onClick={() => returnToLobbies()}><Typography sx={{ fontFamily: 'Monospace'}}>{'Return to Lobbies'}</Typography></Button>;

    gameboardJSX = (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
            <Typography sx={{ fontFamily: 'Monospace', fontSize: '2em' }}>{winner === teamName ? 'You Win!' : winner === null ? '' : 'You Lose :('}</Typography>
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