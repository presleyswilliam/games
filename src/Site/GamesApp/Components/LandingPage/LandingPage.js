import React, { useState, useEffect } from 'react';
import Lobbies from "../Lobbies/Lobbies";
import TicTacToe from '../TicTacToe/TicTacToe';
import Sequence from '../Sequence/Sequence';

export default function LandingPage (props) {
/* API */
    

/* Variables */
    const [gameName, setGameName] = useState('');

    
/* Functions */
    useEffect(() => {
        window.socket.on('startingGame', (gameName) => { setGameName(gameName); });

        return () => {  // Teardown function
            window.socket.off('startingGame');
        };
    }, []); // Initializes because of empty array dependency


/* JSX */
    let landingPageJSX;
    if (gameName === '') {
        landingPageJSX = <Lobbies setGameName={setGameName} />;
    } else if (gameName === 'TicTacToe') {
        landingPageJSX = <TicTacToe setGameName={setGameName} />;
    } else if (gameName === 'Sequence') {
        landingPageJSX = <Sequence setGameName={setGameName} />;
    }

    return (
        <React.Fragment>
            {landingPageJSX}
        </React.Fragment>
    );
}