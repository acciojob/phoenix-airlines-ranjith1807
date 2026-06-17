import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setSearchQuery, setSelectedFlight } from '../store/flightSlice';

const FlightSearch = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState({
    tripType: 'one-way',
    source: '',
    destination: '',
    date: ''
  });
  const [flights, setFlights] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(formData));
    // Mocking an API response
    setFlights([
      { id: 1, airline: 'Phoenix Air', price: '$250', time: '10:00 AM' },
      { id: 2, airline: 'Phoenix Express', price: '$199', time: '02:30 PM' }
    ]);
  };

  const handleBook = (flight) => {
    dispatch(setSelectedFlight(flight));
    history.push('/flight-booking');
  };

  return (
    <div>
      <h2>Search Flights</h2>
      <form onSubmit={handleSearch}>
        <select onChange={(e) => setFormData({...formData, tripType: e.target.value})}>
          <option value="one-way">One-way</option>
          <option value="round-trip">Round-trip</option>
        </select>
        <input type="text" placeholder="Source" required onChange={(e) => setFormData({...formData, source: e.target.value})} />
        <input type="text" placeholder="Destination" required onChange={(e) => setFormData({...formData, destination: e.target.value})} />
        <input type="date" required onChange={(e) => setFormData({...formData, date: e.target.value})} />
        <button type="submit">Search</button>
      </form>

      {flights.length > 0 && (
        <div className="results">
          {flights.map(flight => (
            <div key={flight.id} className="flight-card">
              <p>{flight.airline} - {flight.price} - {flight.time}</p>
              {/* Cypress required selector */}
              <button className="book-flight" onClick={() => handleBook(flight)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;