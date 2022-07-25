import React, { useState, useEffect } from 'react';
import CircleIcon from '@mui/icons-material/Circle';

export default function Gamepiece (props) {
/* API */
    

/* Variables */


/* Functions */


/* CSS Classes */


/* JSX */
    let gamepieceJSX;
    gamepieceJSX = <CircleIcon style={{ color: props.boardValue }} />;

    return (
        <React.Fragment>
            {gamepieceJSX}
        </React.Fragment>
    );
}