import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import GamesApp from './GamesApp/GamesApp';


window.games = {};
function detectMobile() {
  return ( ( window.innerWidth <= 800 ) /*&& ( window.innerHeight <= 600 )*/ );
}
window.games.isMobile = detectMobile();


export default function Site (props) {

    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path='/' element={<div>Index</div>} /> */}
                <Route path="/games" element={<GamesApp />} />
                {/* <Route path="/games/test" element={<div>/games/test</div>} /> */}
                <Route path="*" element={<GamesApp />} />
            </Routes>
        </BrowserRouter>
    );
}