import React, { useState, useEffect } from 'react';
import { FaCrown } from 'react-icons/fa';
import { MdCircle } from 'react-icons/md';
import './Gamepiece.css';

interface GamepieceProps {
    boardValue: string;
    isLastPlaced: boolean;
}

export default function Gamepiece (props: GamepieceProps) {
/* API */
    

/* Variables */


/* Functions */


/* CSS Classes */

/* JSX */
    let gamepieceJSX;

    let animation = '0.5s dropPiece';
    if (props.isLastPlaced) { animation += ', 0.75s 0.5s lastPlacedIndicator infinite alternate'; }
    
    if (props.boardValue.split('_S').length === 1) {
        gamepieceJSX = <MdCircle size={'2em'} style={{ animation: animation, color: props.boardValue }} />;
    } else {
        gamepieceJSX = <FaCrown size={'2em'} style={{ animation: animation, color: props.boardValue.split('_S')[0] }} />;
    }

    return (
        <React.Fragment>
            {gamepieceJSX}
        </React.Fragment>
    );
}