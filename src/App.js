import './App.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Site from './Site/Site';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Site />
      </BrowserRouter>
    </div>
  );
}

export default App;
