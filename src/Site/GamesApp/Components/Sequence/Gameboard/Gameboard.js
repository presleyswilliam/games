import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import PlayingCard from './PlayingCard/PlayingCard';

export default function Gameboard (props) {
/* API */
    function getGameboardLayout() {
        let roomName = window.sessionStorage.getItem('roomName');
        window.socket.emit('getGameboardLayout', roomName, (gameboardLayout) => {
            // console.log(gameboardLayout)
            setGameboardLaout(gameboardLayout);
        })
    }

    function getGameboard() {
        let roomName = window.sessionStorage.getItem('roomName');
        window.socket.emit('getGameboard', roomName, (gameboard, turn, winner) => {
            setGameboard(gameboard);
            setTurn(turn);
            if (winner !== null) { setWinner(winner); }
        })
    }

    function getHand() {
        let roomName = window.sessionStorage.getItem('roomName');
        let teamName = window.sessionStorage.getItem('teamName');
        window.socket.emit('getHand', roomName, teamName, (hand) => {
            setHand(hand);
        })
    }

    function updateGameState() {
        getGameboard();
        getHand();
    }
    
/* Variables */
    let gameboardInit = Array(10).fill('').map(x => Array(10).fill(''));
    let handInit = Array(7).fill('');
    const [gameboardLayout, setGameboardLaout] = useState(gameboardInit);
    const [gameboard, setGameboard] = useState(gameboardInit);
    const [turn, setTurn] = useState('');
    const [hand, setHand] = useState(handInit);
    const [handCardState, setHandCardState] = useState(handInit);
    const [winner, setWinner] = useState(null);
    
    let teamName = window.sessionStorage.getItem('teamName');
    let gameStatusText = '';
    if (winner === teamName) { gameStatusText = 'You Win!'; }
    else if (winner === 'cat') { gameStatusText = '🐈'; }
    else if (winner !== null) { gameStatusText = 'You Lose :('; }
    else if (winner === null && turn === teamName) { gameStatusText = 'Your Turn'; }
    else if (winner === null && turn !== teamName) { gameStatusText = `${turn}'s Turn`; }
    
/* Functions */
    useEffect(() => {
        getGameboardLayout();
        getGameboard();
        getHand();
    
        window.socket.on('updateGameboard', () => { updateGameState(); });
    
        return () => {  // Teardown function
            window.socket.off('updateGameboard');
        };
    }, []); // Initializes because of empty array dependency

    function handleHandClick(index) {
        if (winner !== null) { return; }
        let teamName = window.sessionStorage.getItem('teamName');
        let roomName = window.sessionStorage.getItem('roomName');

        let newHandCardState = '';
        if (handCardState[index] === '') { newHandCardState = 'raised'; }
        else if (handCardState[index] === 'raised') { window.socket.emit('swapHandCard', roomName, teamName, index); newHandCardState = ''; }
        
        let newHandCardStateArr = handInit;
        newHandCardStateArr[index] = newHandCardState;
        setHandCardState(newHandCardStateArr);
    }
    
    function placePiece(rowIndex, colIndex) {
        let teamName = window.sessionStorage.getItem('teamName');
        let roomName = window.sessionStorage.getItem('roomName');
        
        /* Validation */
        if (turn !== teamName) { /*alert('Wait your turn.');*/ return; }
        
        let boardCardRank = gameboardLayout[rowIndex][colIndex];
        let handCardSelectedIndex = handCardState.indexOf('raised');
        let handCardSelectedRank = hand[handCardSelectedIndex];
        let isHandCardSelected = handCardSelectedIndex !== -1;
        let isHandCardSameAsBoardCard = hand[handCardSelectedIndex] === boardCardRank;
        if (!isHandCardSelected) { /*alert('Select a card from your hand to use before placing a token.');*/ return; } // Card must be selected in hand
        if (!isHandCardSameAsBoardCard && !handCardSelectedRank.includes('Eyed')) { /*alert('The selected card from your hand must be the same as your selection.');*/ return; } // Card must match the spot on the board

    
        let handIndex = [handCardSelectedIndex];
        let boardCoords = [rowIndex, colIndex];
        let coord = { 'handIndex': handIndex, 'boardCoords': boardCoords};
    
        window.socket.emit('placePiece', roomName, teamName, coord);
        setHandCardState(handInit);
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

    let boardJSX = 
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {gameboardLayout.map(function (row, rowIndex) {
                return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>{row.map(function(item, colIndex) {
                    return <PlayingCard rank_suit={item} boardValue={gameboard[rowIndex][colIndex]} handCardState={''} onClick={() => placePiece(rowIndex, colIndex)} />
                })}</Box>
            })}
        </Box>;

    let handJSX = 
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 1, height: 80 }}>
            {hand.map(function (item, index) {
                return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}><PlayingCard handCardState={handCardState[index]} rank_suit={item} boardValue={''} onClick={() => handleHandClick(index)} /></Box>
            })}
        </Box>;

    let returnButton = <Button sx={{ margin: 2 }} variant='contained' size='small' onClick={() => returnToLobbies()}><Typography sx={{ fontFamily: 'Monospace'}}>{'Return to Lobbies'}</Typography></Button>;
    
    gameboardJSX = (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <Typography sx={{ fontFamily: 'Monospace', fontSize: '2em' }}>{gameStatusText}</Typography>
            {boardJSX}
            {winner !== null ? returnButton : handJSX}
        </Box>
    );

    return (
        <React.Fragment>
            {gameboardJSX}
        </React.Fragment>
    );
}