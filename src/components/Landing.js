import React from 'react';
import { useHistory } from 'react-router-dom';

const Landing = () => {
  const history = useHistory();

  return (
    <div className="landing-page">
      <h1>Welcome to Flight Booking App</h1>
      <button 
        className="search-btn" 
        onClick={() => history.push('/flight-search')}
      >
        SEARCH FLIGHTS HERE
      </button>
    </div>
  );
};

export default Landing;