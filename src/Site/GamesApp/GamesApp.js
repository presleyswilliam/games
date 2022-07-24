import React, { useState, useEffect } from 'react';
import LandingPage from './Components/LandingPage/LandingPage.js';
import socketIOClient from 'socket.io-client';  // https://socket.io/docs/v4/client-api/


export default function GamesApp (props) {
  /* API */
      
  
  /* Variables */
      const [landingPageComponent, setLandingPageComponent] = useState(<React.Fragment></React.Fragment>);
  
      useEffect(() => {
        setUpSocketIO();
        setLandingPageComponent(<LandingPage />);
  
        return;  // Teardown function
      }, []); // Initializes because of empty array dependency
  
  
  /* Functions */
  function setUpSocketIO() {
    let HOST = window.location.origin.replace(/^http/,'ws');
    // let namespace = '/games';
    // let url = HOST + namespace;
    window.socket = socketIOClient(HOST);
    window.socket.on("connect", () => {
      // if (window.sessionStorage.getItem('teamName') === null) { window.sessionStorage.setItem('teamName', window.socket.id) }
      reconnect();
    });
    function reconnect() {
      let roomName = window.sessionStorage.getItem('roomName');
      let teamName = window.sessionStorage.getItem('teamName');
    
      if (roomName === null || teamName === null) {
        window.sessionStorage.removeItem('roomName');
        window.sessionStorage.removeItem('teamName');
        return;
      }
    
      window.socket.emit('joinGame', roomName, teamName, (roomJoined, teamJoined) => {
        if (roomJoined === null) { window.sessionStorage.removeItem('roomName'); }
        if (teamJoined === null) { window.sessionStorage.removeItem('teamName'); }
      });
    
      window.socket.emit('updateLobbies');
    }
  }
  
  
  /* CSS Classes */
  
  
  /* JSX */
  let gamesAppJSX;
  gamesAppJSX = landingPageComponent;

  return (
    <React.Fragment>
      {gamesAppJSX}
    </React.Fragment>
  );
}