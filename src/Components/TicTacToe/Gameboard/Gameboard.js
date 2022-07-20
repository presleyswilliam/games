import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";

export default function Gameboard (props) {
/* API */
function getGameBoard() {
    let roomName = window.sessionStorage.getItem('roomName');
    window.socket.emit('getGameBoard', roomName, (gameboard) => {
        console.log(gameboard)
        setGameboard(gameboard);
    })
}

/* Variables */
const [gameboard, setGameboard] = useState([['', '', ''],['', '', ''],['', '', '']]);

/* Functions */
useEffect(() => {
    getGameBoard();

    window.socket.on('updateGameboard', () => { getGameBoard(); });

    return () => {  // Teardown function
        window.socket.off('updateGameboard');
    };
}, []); // Initializes because of empty array dependency

function placePiece(rowIndex, colIndex) {
    let roomName = window.sessionStorage.getItem('roomName');
    let coord = [rowIndex, colIndex];
    window.socket.emit('setPiece', roomName, coord, (response) => {
        // console.log(response)
    })
}

/* CSS Classes */


/* JSX */
    let gameboardJSX;
    // gameboardJSX = (<React.Fragment>
    // <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 1 }}><Card>1</Card><Card>2</Card><Card>3</Card></Box>
    // <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 1 }}><Card>4</Card><Card>5</Card><Card>6</Card></Box>
    // <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 1 }}><Card>7</Card><Card>8</Card><Card>9</Card></Box>
    // </React.Fragment>);
    gameboardJSX = <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' }}>
        {gameboard.map(function (row, rowIndex) {
            return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 1 }}>{row.map(function(item, colIndex) {
                return <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 100, height: 100, margin: 0.5, backgroundColor: 'lightgrey', cursor: 'pointer' }} onClick={() => placePiece(rowIndex, colIndex)}>{item == '' ? colIndex : item}</Card>
            })}</Box>
        })}
    </Box>;

    return (
        <React.Fragment>
            {gameboardJSX}
        </React.Fragment>
    );
}