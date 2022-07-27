import React, { useState, useEffect } from 'react';
import ActiveGameCard from "./ActiveGameCard/ActiveGameCard";
import CreateNewGame from './CreateNewGame/CreateNewGame';
import { Box } from "@mui/material";

export default function Lobbies (props) {
/* API */
    function getLobbies() {
        window.socket.emit('getActiveLobbies', (lobbies) => {
            // console.log(lobbies)
            setLobbies(lobbies);
        })
    }
    
/* Variables */
    const [lobbies, setLobbies] = useState({});

    let gameType;
    let teamInfo;
    let canJoin;
    let canStart;
    let isJoined;

    
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
    let lobbyCardsJSX;
    lobbyCardsJSX = 
    Object.keys(lobbies).map(function(lobbyNameKey, index) {
        if (lobbies[lobbyNameKey]['isJoined'] && lobbies[lobbyNameKey]['isStarted']) { props.setGameName(lobbies[lobbyNameKey]['gameType']) } else if (lobbies[lobbyNameKey]['isStarted'] === true) { return; }

        gameType = lobbies[lobbyNameKey]['gameType'];
        teamInfo = lobbies[lobbyNameKey]['teamInfo'];
        canJoin = lobbies[lobbyNameKey]['canJoin'];
        canStart = lobbies[lobbyNameKey]['canStart'];
        isJoined = lobbies[lobbyNameKey]['isJoined'];

        return <ActiveGameCard roomName={lobbyNameKey} gameType={gameType} teamInfo={teamInfo} canJoin={canJoin} canStart={canStart} isJoined={isJoined}/>;
    });

    lobbiesJSX = <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>{lobbyCardsJSX}<CreateNewGame /></Box>;

    return (
        <React.Fragment>
            {lobbiesJSX}
        </React.Fragment>
    );
}