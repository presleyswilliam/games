import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

window.sequenceApp = {};

function detectMobile() {
  return ( ( window.innerWidth <= 800 ) /*&& ( window.innerHeight <= 600 )*/ );
}
window.sequenceApp.isMobile = detectMobile();

let HOST = window.location.origin.replace(/^http/,'ws');
let socket = new WebSocket(HOST);
let el;
socket.onmessage = function (event) {
  console.log(event.data);
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
