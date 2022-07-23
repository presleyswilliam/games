import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import socketIOClient from 'socket.io-client';  // https://socket.io/docs/v4/client-api/



window.sequenceApp = {};

function detectMobile() {
  return ( ( window.innerWidth <= 800 ) /*&& ( window.innerHeight <= 600 )*/ );
}
window.sequenceApp.isMobile = detectMobile();

let HOST = window.location.origin.replace(/^http/,'ws');
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

  window.socket.emit('joinGame', roomName, (roomJoined, teamJoined) => {
    if (roomJoined === null) { window.sessionStorage.removeItem('roomName'); }
    if (teamJoined === null) { window.sessionStorage.removeItem('teamName'); }
  });

  window.socket.emit('updateLobbies');
}



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
