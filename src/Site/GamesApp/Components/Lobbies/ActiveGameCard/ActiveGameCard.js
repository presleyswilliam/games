import React, { useState } from "react";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";

export default function ActiveGameCard (props) {
/* API */
function startGame() {
    let roomName = window.sessionStorage.getItem('roomName');
    window.socket.emit('startGame', roomName);
}

function joinGame(roomName) {
    window.socket.emit('joinGame', roomName, null, (roomName, teamName, err) => {
        if (err !== null) { alert(err); return; }

        window.sessionStorage.setItem('roomName', roomName);
        window.sessionStorage.setItem('teamName', teamName);
    })
}

function leaveGame() {
    let roomName = window.sessionStorage.getItem('roomName');
    let teamName = window.sessionStorage.getItem('teamName');
    window.socket.emit('leaveGame', roomName, teamName);

    window.sessionStorage.removeItem('roomName');
    window.sessionStorage.removeItem('teamName');
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
    let teamName = window.sessionStorage.getItem('teamName');
    let teamsTally = props.teamsTally;

    
/* Functions */


/* CSS Classes */
    let card = () => ({
        backgroundColor: props.joined ? 'lightgreen' : 'lightgray'
    });

    let buttonColorStyle = (teamNameParam) => ({
        backgroundColor: teamName === teamNameParam ? teamNameParam : 'lightslategray',
        fontWeight: teamName === teamNameParam ? 'bold' : 'normal',
        color: 'white'
    });


/* JSX */
    let gameCardJSX;

    let teamsTallyJSX = 
    Object.keys(teamsTally).map(function(teamNameParam) {
        let isDisabled = (!isJoined) || (teamName === teamNameParam);

        return <Button sx={{ margin: 0.5 }} variant='contained' size='small' disabled={isDisabled} style={{...buttonColorStyle(teamNameParam)}} onClick={() => joinTeam(teamNameParam)}>{teamNameParam} {teamsTally[teamNameParam]}</Button>;
    });

    let teamsRow = <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>{teamsTallyJSX}</Box>

    let gameActionButtonsRowJSX;
    if (isJoined) {
        gameActionButtonsRowJSX = (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                <Button sx={{ backgroundColor: 'lightslategray', margin: 0.5 }}  variant='contained' size='small' onClick={() => leaveGame()}>Leave</Button>
                <Button sx={{ margin: 0.5 }}  variant='contained' size='small' disabled={!canStart} onClick={() => startGame()}>Start</Button>
            </Box>
            );
    } else {
        gameActionButtonsRowJSX = <Button variant='contained' size='small' disabled={!canJoin} onClick={() => joinGame(roomName)}>Join</Button>;
    }

    gameCardJSX = (
        <Card sx={{ width: 200, borderRadius: '0.5em', margin: 1 }} style={{ ...card() }}>
            <CardContent>
                <Typography>{roomName}</Typography>
                <Typography sx={{ fontFamily: 'Monospace'}}>{`${gameType}`}</Typography>
                <Typography>{teamsRow}</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
                <Typography>{gameActionButtonsRowJSX}</Typography>
            </CardActions>
        </Card>
    );

    return (
        <React.Fragment>
            {gameCardJSX}
        </React.Fragment>
    );
}