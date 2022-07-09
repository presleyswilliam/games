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
// socket.on("connect", () => {
//   console.log(socket);
// });
window.addEventListener("focus", () => socket.connect())

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
