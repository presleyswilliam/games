import React, { useState, useEffect } from 'react';
import { Button, Card, CardActions, MenuItem, Select, TextField } from "@mui/material";

export default function CreateNewGame (props) {
/* API */
    function newGame(roomName, gameType) {
        window.socket.emit('newGame', gameType, roomName, (newRoomName, newTeamName, err) => {
            if (err !== null) { alert(err); return; }

            window.sessionStorage.setItem('roomName', newRoomName);
            window.sessionStorage.setItem('teamName', newTeamName);
        })
    }
    

/* Variables */
    const [newGameState, setNewGameState] = useState('newGameButton');
    const [newLobbyName, setNewLobbyName] = useState('');
    const [newLobbyGameType, setNewGameType] = useState('');
    
/* Functions */
    function resetComponentState() {
        setNewGameState('newGameButton');
        setNewLobbyName('');
        setNewGameType('');
    }

    function createNewGame() {
        if (newLobbyName === '') { alert('Please enter a room name.'); return; }
        if (newLobbyGameType === '') { alert('Please select a game type.'); return; }
        newGame(newLobbyName, newLobbyGameType);

        resetComponentState();
    }
    function cancelNewGame() {
        resetComponentState();
    }


/* CSS Classes */
    let gameCard = () => ({
        display: 'inline-block',
        height: '7em',
        width: '12em',
        borderRadius: '0.5em',
        margin: '1em',
        backgroundColor: 'lightgray'
    });


/* JSX */
    let newGameJSX;
    
    if (newGameState === 'newGameButton'){
        newGameJSX = <React.Fragment><Button variant='contained' size='small' onClick={() => setNewGameState('chooseOptions')}>Create New Game</Button></React.Fragment>;
    } else if (newGameState === 'chooseOptions') {
        newGameJSX = (
            <React.Fragment>
                <Card sx={{ width: 200, borderRadius: '0.5em', backgroundColor: 'lightgrey' }}>
                    <br/>
                    <TextField variant='outlined' sx={{ width: 8/10 }} size='small' label='New Lobby Name' onInput={e => setNewLobbyName(e.target.value)} />
                    <TextField variant='outlined' sx={{ width: 8/10, margin: 1 }} size='small' label='- Select Game -' value={newLobbyGameType} select onChange={e => setNewGameType(e.target.value)}>
                        <MenuItem value='TicTacToe'>TicTacToe</MenuItem>
                        <MenuItem value='Sequence' disabled>Sequence</MenuItem>
                        <MenuItem value='ConnectFour' disabled>Connect Four</MenuItem>
                        <MenuItem value='Trash' disabled>Trash</MenuItem>
                    </TextField>
                    <CardActions sx={{ justifyContent: 'center' }}>
                        <Button variant='contained' size='small' onClick={() => cancelNewGame()}>Cancel</Button>
                        <Button variant='contained' size='small' onClick={() => createNewGame()}>Create</Button>
                    </CardActions>
                </Card>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {newGameJSX}
        </React.Fragment>
    );
}