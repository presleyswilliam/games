import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

window.sequenceApp = {};

// window.sequenceApp.boardState = Array(10).fill(0).map(x => Array(10).fill(0));
// window.sequenceApp.sequences = Array(4).fill(0).map(x => Array(5).fill(0).map(y => Array(2).fill(0)));

function detectMobile() {
  return ( ( window.innerWidth <= 800 ) /*&& ( window.innerHeight <= 600 )*/ );
}
window.sequenceApp.isMobile = detectMobile();

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
