import React from 'react';
import logo from './logo.svg';
import './App.css';
import MonthView from "./demos/MonthView";

function App() {
  return (
    <div className="App">
      <h1>
        Fulcalendar resource timeline month view
      </h1>
      <div className='container'>
        <MonthView />
      </div>
    </div>
  );
}

export default App;
