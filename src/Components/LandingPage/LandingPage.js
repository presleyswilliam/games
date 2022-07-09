import React, { useState, useEffect } from 'react';
import Lobbies from "../Lobbies/Lobbies";
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
        landingPageJSX = <Lobbies />;
    } else if (gameName === 'Sequence') {
        landingPageJSX = <Sequence />;
    }

    return (
        <React.Fragment>
            {landingPageJSX}
        </React.Fragment>
    );
}