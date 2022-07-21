import React, { useState, useEffect } from 'react';
import ActiveGameCard from "./ActiveGameCard/ActiveGameCard";
import CreateNewGame from './CreateNewGame/CreateNewGame';
import { Box } from "@mui/material";

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
        if (lobbies[lobbyNameKey]['joined'] && lobbies[lobbyNameKey]['isStarted']) { props.setGameName(lobbies[lobbyNameKey]['gameType']) } else if (lobbies[lobbyNameKey]['isStarted'] === true) { return; }
        return <ActiveGameCard name={lobbyNameKey} gameType={lobbies[lobbyNameKey]['gameType']} maxPlayers={lobbies[lobbyNameKey]['maxPlayers']} canJoin={lobbies[lobbyNameKey]['numJoined'] < lobbies[lobbyNameKey]['maxPlayers']} canStart={lobbies[lobbyNameKey]['numJoined'] >= lobbies[lobbyNameKey]['minPlayers'] && lobbies[lobbyNameKey]['numJoined'] <= lobbies[lobbyNameKey]['maxPlayers']} numJoined={lobbies[lobbyNameKey]['numJoined']} joined={lobbies[lobbyNameKey]['joined']}/>
    });

    lobbiesJSX = <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 1, margin: 1, bgcolor: 'background.paper', borderRadius: 1 }}>{lobbyCards}<CreateNewGame /></Box>;

    return (
        <React.Fragment>
            {lobbiesJSX}
        </React.Fragment>
    );
}