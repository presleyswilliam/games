import React, { useState } from "react";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";

export default function ActiveGameCard (props) {
/* API */
function startGame(roomName) {
    window.socket.emit('startGame', roomName);
}

function joinGame(roomName) {
    window.socket.emit('joinGame', roomName, (roomName, teamName, err) => {
        if (err !== null) { alert(err); return; }

        window.sessionStorage.setItem('roomName', roomName);
        window.sessionStorage.setItem('teamName', teamName);
    })
}

function joinTeam(newTeamName) {
    let prevTeamName = window.sessionStorage.getItem('teamName');
    window.socket.emit('joinTeam', prevTeamName, newTeamName, (teamName, err) => {
        if (err !== null) { alert(err); return; }

        window.sessionStorage.setItem('teamName', teamName);
    })
}
    

/* Variables */
    let roomName = props.roomName;
    let gameType = props.gameType;
    let isJoined = props.isJoined;
    let canStart = props.canStart;
    let canJoin = props.canJoin;
    let clientTeamName = window.sessionStorage.getItem('teamName');
    let teamsTally = props.teamsTally;

    
/* Functions */


/* CSS Classes */
    let card = () => ({
        backgroundColor: props.joined ? 'lightgreen' : 'lightgray'
    });

    let buttonColorStyle = (teamName) => ({
        backgroundColor: clientTeamName === teamName ? teamName : 'lightslategray',
        color: 'white'
    });


/* JSX */
    let gameCardJSX;

    let teamsTallyJSX = 
    Object.keys(teamsTally).map(function(teamName) {
        let isDisabled = (!isJoined) || (clientTeamName === teamName);

        return <Button sx={{ margin: 0.5 }} variant='contained' size='small' disabled={isDisabled} style={{...buttonColorStyle(teamName)}} onClick={() => joinTeam(teamName)}>{teamName} {teamsTally[teamName]}</Button>;
    });

    let teamsRow = <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>{teamsTallyJSX}</Box>

    let startJoinButtonJSX;
    if (isJoined) {
        startJoinButtonJSX = <Button variant='contained' size='small' disabled={!canStart} onClick={() => startGame(roomName)}>Start</Button>;
    } else {
        startJoinButtonJSX = <Button variant='contained' size='small' disabled={!canJoin} onClick={() => joinGame(roomName)}>Join</Button>;
    }

    gameCardJSX = (
        <Card sx={{ width: 200, borderRadius: '0.5em', margin: 1 }} style={{ ...card() }}>
            <CardContent>
                <Typography>{roomName}</Typography>
                <Typography sx={{ fontFamily: 'Monospace'}}>{`${gameType}`}</Typography>
                <Typography>{teamsRow}</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
                <Typography>{startJoinButtonJSX}</Typography>
            </CardActions>
        </Card>
    );

    return (
        <React.Fragment>
            {gameCardJSX}
        </React.Fragment>
    );
}