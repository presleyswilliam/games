import React, { useState, useEffect } from 'react';

export default function CreateNewGame (props) {
/* API */
    function newSequenceGame(roomName) {
        window.socket.emit('newGame', 'Sequence', roomName, (newRoomName) => {
            window.sessionStorage.setItem('roomName', roomName);
            console.log(`Joined room ${newRoomName}, a game of Sequence.`);
        })
    }
    

/* Variables */
    const [newGameState, setNewGameState] = useState('newGameButton');
    const [newLobbyName, setNewLobbyName] = useState('');
    const [newLobbyGameType, setNewGameType] = useState('Sequence');
    
/* Functions */
    function resetComponentState() {
        setNewGameState('newGameButton');
        setNewLobbyName('');
        setNewGameType('Sequence');
    }

    function createNewGame() {
        if (newLobbyName === '') { alert('Please enter a room name.'); return; }
        if (newLobbyGameType === 'Sequence') {
            newSequenceGame(newLobbyName);
        } else if (newLobbyGameType === 'ConnectFour') {
            // newConnectFourGame();
        } else if (newLobbyGameType === 'Trash') {
            // newTrashGame();
        }

        resetComponentState();
    }
    function cancelNewGame() {
        resetComponentState();
    }


/* CSS Classes */
    let newGameButton = () => ({
        display: 'inline-block',
        margin: '1em'
    });
    let gameCard = () => ({
        display: 'inline-block',
        height: '6em',
        width: '10em',
        borderRadius: '0.5em',
        margin: '1em',
        backgroundColor: 'lightgray'
    });
    let createButton = () => ({
        display: 'inline-block'
    });


/* JSX */
    let newGameJSX;
    
    if (newGameState === 'newGameButton'){
        newGameJSX = <React.Fragment><button style={{...newGameButton()}} onClick={() => setNewGameState('chooseOptions')}>Create New Game</button></React.Fragment>;
    } else if (newGameState === 'chooseOptions') {
        newGameJSX = (
            <React.Fragment>
                <div style={{...gameCard()}}>
                    <br/>
                    <input placeholder='New Lobby Name' onInput={e => setNewLobbyName(e.target.value)} />
                    <select value={newLobbyGameType} onChange={e => setNewGameType(e.target.value)}>
                        <option value='Sequence'>Sequence</option>
                        <option value='ConnectFour' disabled>Connect Four</option>
                        <option value='Trash' disabled>Trash</option>
                    </select>
                    <button style={{...createButton()}} onClick={() => cancelNewGame()}>Cancel</button>
                    <button style={{...createButton()}} onClick={() => createNewGame()}>Create</button>
                </div>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {newGameJSX}
        </React.Fragment>
    );
}