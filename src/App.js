import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from './components/Landing';
import FlightSearch from './components/FlightSearch';
import FlightBooking from './components/FlightBooking';
import Confirmation from './components/Confirmation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="navbar">
          <h2>Flight Booking App</h2>
        </header>
        <div className="container">
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/flight-search" component={FlightSearch} />
            <Route path="/flight-booking" component={FlightBooking} />
            <Route path="/confirmation" component={Confirmation} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;