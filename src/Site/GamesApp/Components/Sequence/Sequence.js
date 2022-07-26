import React, { useState, useEffect } from 'react';
import Gameboard from './Gameboard/Gameboard';

export default function Sequence (props) {
/* API */
    

/* Variables */


/* Functions */


/* CSS Classes */


/* JSX */
    let sequenceJSX;
    sequenceJSX = <Gameboard setGameName={props.setGameName} />;

    return (
        <React.Fragment>
            {sequenceJSX}
        </React.Fragment>
    );
}