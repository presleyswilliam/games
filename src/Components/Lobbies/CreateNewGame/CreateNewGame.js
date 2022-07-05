import React, { useState, useEffect } from 'react';

export default function CreateNewGame (props) {
/* API */
    function newSequenceGame(roomName) {
        window.socket.emit('newSequenceGame', roomName, (response) => {
            console.log(response);
        })
    }
    

/* Variables */
    const [newGameState, setNewGameState] = useState('newGameButton');
    const [newLobbyName, setNewLobbyName] = useState('');
    const [newLobbyGameType, setNewGameType] = useState('sequence');
    
/* Functions */
    function resetComponentState() {
        setNewGameState('newGameButton');
        setNewLobbyName('');
        setNewGameType('sequence');
    }

    function createNewGame() {
        if (newLobbyName === '') { alert('Please enter a room name.'); return; }
        if (newLobbyGameType === 'sequence') {
            newSequenceGame(newLobbyName);
        } else if (newLobbyGameType === 'connectFour') {
            // newConnectFourGame();
        } else if (newLobbyGameType === 'trash') {
            // newTrashGame();
        }

        resetComponentState();
    }
    function cancelNewGame() {
        resetComponentState();
    }


/* CSS Classes */
    let newGameButton = () => ({
        display: 'inline-block'
    });
    let gameCard = () => ({
        display: 'inline-block',
        height: '6em',
        width: '10em',
        borderRadius: '0.5em',
        margin: '1em',
        backgroundColor: 'lightgray'
    });


/* JSX */
    let newGameJSX;
    
    if (newGameState === 'newGameButton'){
        newGameJSX = <button style={{...newGameButton()}} onClick={() => setNewGameState('chooseOptions')}>Create New Game</button>;
    } else if (newGameState === 'chooseOptions') {
        newGameJSX = (
            <React.Fragment>
                <div style={{...gameCard()}}>
                    <input placeholder='New Lobby Name' onInput={e => setNewLobbyName(e.target.value)} />
                    <select value={newLobbyGameType} onChange={e => setNewGameType(e.target.value)}>
                        <option value='sequence'>Sequence</option>
                        <option value='connectFour'>Connect Four</option>
                        <option value='trash'>Trash</option>
                    </select>
                    <button style={{...newGameButton()}} onClick={() => cancelNewGame()}>Cancel</button>
                    <button style={{...newGameButton()}} onClick={() => createNewGame()}>Create</button>
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