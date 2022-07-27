import React, { useState, useEffect } from 'react';
import { MdCircle } from 'react-icons/md';
import './Gamepiece.css';

export default function Gamepiece (props) {
/* API */
    

/* Variables */


/* Functions */


/* CSS Classes */

/* JSX */
    let gamepieceJSX;
    gamepieceJSX = <MdCircle size={'2em'} style={{ animation: 'dropPiece 0.5s', color: props.boardValue }} />;

    return (
        <React.Fragment>
            {gamepieceJSX}
        </React.Fragment>
    );
}