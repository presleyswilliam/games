import React, { useState, useEffect } from 'react';
import ActiveGameCard from "./ActiveGameCard/ActiveGameCard";
import CreateNewGame from './CreateNewGame/CreateNewGame';

export default function Lobbies (props) {
/* API */
    function getLobbies() {
        window.socket.emit('getActiveLobbies', (lobbies) => {  // response is: { lobbyName0: { gameType0: <gameType0>, gameNumJoined0: <gameNumJoined0>, gameCapacity0: <gameCapacity0> } [,...{}] }
            setLobbies(lobbies);
            console.log(lobbies)
        })
    }
    
/* Variables */
    const [lobbies, setLobbies] = useState({});

    
/* Functions */
    useEffect(() => {
        getLobbies();

        window.socket.on('updateLobbies', () => { getLobbies(); });

        return () => {  // Teardown function
            window.socket.off('updateLobbies');
        };
    }, []); // Initializes because of empty array dependency


/* JSX */
    let lobbiesJSX;
    let lobbyCards;
    lobbyCards = 
    Object.keys(lobbies).map(function(lobbyNameKey, index) {
        return <ActiveGameCard name={lobbyNameKey} gameType={lobbies[lobbyNameKey]['gameType']} numJoined={lobbies[lobbyNameKey]['numJoined']} joined={lobbies[lobbyNameKey]['joined']}/>
    });

    lobbiesJSX = <React.Fragment>{lobbyCards}<CreateNewGame /></React.Fragment>;

    return (
        <React.Fragment>
            {lobbiesJSX}
        </React.Fragment>
    );
}