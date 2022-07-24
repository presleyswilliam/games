import React, { useState, useEffect } from 'react';
import Gameboard from './Gameboard/Gameboard';

export default function TicTacToe (props) {
/* API */
    

/* Variables */


/* Functions */


/* CSS Classes */


/* JSX */
    let ticTacToeJSX;
    ticTacToeJSX = <Gameboard setGameName={props.setGameName} />;

    return (
        <React.Fragment>
            {ticTacToeJSX}
        </React.Fragment>
    );
}