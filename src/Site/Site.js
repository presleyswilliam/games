import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link, Routes, Route, useLocation } from 'react-router-dom'
import GamesApp from './GamesApp/GamesApp';


window.games = {};
function detectMobile() {
  return ( ( window.innerWidth <= 800 ) /*&& ( window.innerHeight <= 600 )*/ );
}
window.games.isMobile = detectMobile();


export default function Site (props) {
/* Variables */
    const location = useLocation();

/* Functions */
    useEffect(() => {
        updateManifestJson();

        return;  // Teardown function
    }, [location]); // Only runs on change of location

    function updateManifestJson() {
        var myDynamicManifest = {
        "short_name": "PSW Games",
        "name": "PSW Games",
        "icons": [
            {
            "src": window.location.origin + "/favicon.ico",
            "sizes": "64x64 32x32 24x24 16x16",
            "type": "image/x-icon"
            },
            {
            "src": window.location.origin + "/logo192.png",
            "type": "image/png",
            "sizes": "192x192"
            },
            {
            "src": window.location.origin + "/logo512.png",
            "type": "image/png",
            "sizes": "512x512"
            }
        ],
        "start_url": window.location.href,
        "scope": window.location.href,
        "display": "standalone",
        "theme_color": "#ffffff",
        "background_color": "#ffffff"
        }

        const stringManifest = JSON.stringify(myDynamicManifest);
        const blob = new Blob([stringManifest], {type: 'application/json'});
        const manifestURL = URL.createObjectURL(blob);
        document.querySelector('#dynamic-manifest').setAttribute('href', manifestURL);
    }

    return (
        <Routes>
            {/* <Route path='/' element={<div>Index</div>} /> */}
            <Route path="/games" element={<GamesApp />} />
            {/* <Route path="/games/test" element={<div>/games/test</div>} /> */}
            <Route path="*" element={<GamesApp />} />
        </Routes>
    );
}