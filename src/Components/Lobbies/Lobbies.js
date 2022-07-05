import React, { useState, useEffect } from 'react';
import ActiveGameCard from "./ActiveGameCard/ActiveGameCard";
import CreateNewGame from './CreateNewGame/CreateNewGame';

export default function Lobbies (props) {
/* API */
    function getLobbies() {
        window.socket.emit('getActiveLobbies', (lobbies, numJoined) => {  // response is array of lobby names
            setLobbyArray(lobbies);
            setNumJoined(numJoined);
        })
    }
    
/* Variables */
    const [lobbies, setLobbyArray] = useState([]);
    const [numJoined, setNumJoined] = useState([]);

    useEffect(() => {
        getLobbies();

        // setIntervalRef(setInterval(getBoardState, 1000));
        // return clearInterval(intervalRef);  // Teardown function
    }, []); // Initializes because of empty array dependency
    
/* Functions */
    window.socket.on('updateLobbies', (data) => { getLobbies(); });

/* JSX */
    let lobbiesJSX;
    let lobbyCards;
    lobbyCards = 
    lobbies.map(function(lobby, index) {
        return <ActiveGameCard name={lobby} numJoined={numJoined[index]} />
    });

    lobbiesJSX = <React.Fragment>{lobbyCards}<CreateNewGame /></React.Fragment>;

    return (
        <React.Fragment>
            {lobbiesJSX}
        </React.Fragment>
    );
}