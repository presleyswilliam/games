import React, { useState, useEffect } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import './Gamepiece.css';

export default function Gamepiece (props) {
/* API */
    

/* Variables */


/* Functions */


/* CSS Classes */

/* JSX */
    let gamepieceJSX;
    gamepieceJSX = <CircleIcon style={{ animation: 'dropPiece 0.5s', color: props.boardValue }} />;

    return (
        <React.Fragment>
            {gamepieceJSX}
        </React.Fragment>
    );
}