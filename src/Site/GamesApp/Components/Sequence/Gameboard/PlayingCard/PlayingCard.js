import React, { useState, useEffect } from 'react';
import { Box, Card, Stack, Typography } from "@mui/material";
import Gamepiece from './Gamepiece/Gamepiece';

export default function PlayingCard (props) {
/* API */
    

/* Variables */
    let widthHeightRatio = 1.4; // 2.5in : 3.5in => 1:1.4
    let rank_suit = props.rank_suit;
    let boardValue = props.boardValue;
    let rank = props.rank_suit.split('_')[0];
    let suit = props.rank_suit.split('_')[1];

    let suitUnicode;
    if (suit === "spades") {
        suitUnicode = '\u{2660}';
    } else if (suit === "clubs") {
        suitUnicode = '\u{2663}';
    } else if (suit === "hearts") {
        suitUnicode = '\u{2665}';
    } else if (suit === "diamonds") {
        suitUnicode = '\u{2666}';
    } else if (suit === "joker") {
        suitUnicode = '\u{2638}';
    } else if (rank === "J") {
        if (suit === "oneEyed") {
            suitUnicode = '\u{2609}';
        } else if (suit === "twoEyed") {
            suitUnicode = '\u{2609}' + '\u{2609}';
        }
    }


/* Functions */


/* CSS Classes */


/* JSX */
    let cardJSX;
    let cardTopBottomRowJSX;
    let cardMiddleRowJSX;

    let color = suit === 'diamonds' || suit === 'hearts' ? 'red' : 'black';

    if (boardValue !== '' && rank_suit !== 'black_joker') {
        cardTopBottomRowJSX = suitUnicode + rank;
        cardMiddleRowJSX = <Gamepiece boardValue={boardValue} />;
    } else if (boardValue !== '' && rank_suit === 'black_joker') {
        cardTopBottomRowJSX = suitUnicode + "JKR";
        cardMiddleRowJSX = <Gamepiece boardValue={boardValue} />;
    } else if (boardValue === '' && rank_suit !== 'black_joker') {
        cardTopBottomRowJSX = suitUnicode;
        cardMiddleRowJSX = rank;
    } else if (boardValue === '' && rank_suit === 'black_joker') {
        cardTopBottomRowJSX = suitUnicode;
        cardMiddleRowJSX = 'JKR';
    }


    cardJSX = (
        <Card sx={{ height: '4.9vmax', width: '3.5vmax', maxHeight: '7vh', maxWidth: '5vh', backgroundColor: '#FAF9F6', color: color, border: '0.1px solid black', borderRadius: '0.25em', margin: 0.5 }} onClick={props.onClick} >
            <Stack sx={{ height: '100%' }} justifyContent='space-between'>
                <Typography sx={{ fontSize: '1.0vmax', letterSpacing: 1, lineHeight: 1, textAlign: 'left', paddingLeft: '8%' }}>{cardTopBottomRowJSX}</Typography>
                <Typography sx={{ fontSize: '1.0vmax', lineHeight: 1 }}>{cardMiddleRowJSX}</Typography>
                <Typography sx={{ fontSize: '1.0vmax', letterSpacing: 1, lineHeight: 1, textAlign: 'left', paddingLeft: '8%', transform: 'rotate(180deg)' }}>{cardTopBottomRowJSX}</Typography>
            </Stack>
        </Card>
    );

    return (
        <React.Fragment>
            {cardJSX}
        </React.Fragment>
    );
}