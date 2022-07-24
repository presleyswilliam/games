import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import GamesApp from './GamesApp/GamesApp';


window.games = {};
function detectMobile() {
  return ( ( window.innerWidth <= 800 ) /*&& ( window.innerHeight <= 600 )*/ );
}
window.games.isMobile = detectMobile();


export default function Site (props) {
/* API */
    

/* Variables */
    // const [variable, setVariable] = useState('initialState');
    // const [intervalRef, setIntervalRef] = useState();

    // useEffect(() => {
    //     setIntervalRef(setInterval(functionName, 1000));

    //     return clearInterval(intervalRef);  // Teardown function
    // }, []); // Initializes because of empty array dependency


/* Functions */


/* CSS Classes */


/* JSX */
    // let componentTEMPLATEJSX;
    // componentTEMPLATEJSX = <GamesApp />;

    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path='/' element={<div>Index</div>} /> */}
                <Route path="/games" element={<GamesApp />} />
                {/* <Route path="/games/test" element={<div>/games/test</div>} /> */}
                {/* <Route path="*" element={<div>Catch All</div>} /> */}
            </Routes>
        </BrowserRouter>
    );
}