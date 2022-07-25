import React, { useState, useEffect } from 'react';
import { Box, Card, Typography } from "@mui/material";

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

    if (boardValue !== '' && rank_suit !== "black_joker") {
        cardTopBottomRowJSX = suitUnicode + rank;
    } else if (boardValue !== '' && rank_suit === "black_joker") {
        cardTopBottomRowJSX = suitUnicode + "JKR";
    } else {
        cardTopBottomRowJSX = suitUnicode;
    }

    cardMiddleRowJSX = rank;

    cardJSX = (
        <Card sx={{ height: '4.2vmax', width: '3vmax', backgroundColor: '#FAF9F6', border: '0.1px solid black', borderRadius: '0.2em', margin: 0.5 }} >
            <Typography sx={{ fontSize: '1vmax', textAlign: 'left', paddingLeft: 0.5 }}>{cardTopBottomRowJSX}</Typography>
            <Typography sx={{ fontSize: '1vmax' }}>{cardMiddleRowJSX}</Typography>
            <Typography sx={{ fontSize: '1vmax', textAlign: 'left', paddingLeft: 0.5, transform: 'rotate(180deg)' }}>{cardTopBottomRowJSX}</Typography>
        </Card>
    );

    return (
        <React.Fragment>
            {cardJSX}
        </React.Fragment>
    );
}