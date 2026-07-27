import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedFlight } from '../store/flightSlice';

const FLIGHTS = [
  { id: 1, name: 'Indigo', from: 'Bangalore', to: 'Delhi', price: 3600, departure: '06:00', arrival: '08:30' },
  { id: 2, name: 'Air India', from: 'Bangalore', to: 'Delhi', price: 4200, departure: '10:00', arrival: '12:30' },
  { id: 3, name: 'SpiceJet', from: 'Bangalore', to: 'Delhi', price: 3900, departure: '14:00', arrival: '16:30' },
];

const CITIES = ['Bangalore', 'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Hyderabad'];

const FlightSearch = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [searched, setSearched] = useState(false);
  const [flights, setFlights] = useState([]);

  const isRoundTripActive = tripType === 'roundtrip';

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    // Flights are only available for Bangalore -> Delhi in this dataset
    if (from === 'Bangalore' && to === 'Delhi') {
      setFlights(FLIGHTS);
    } else {
      setFlights([]);
    }
  };

  const handleBook = (flight, index) => {
    if (isRoundTripActive) {
      // Pair the clicked flight as onward and the next flight as return
      const returnFlight = FLIGHTS[(index + 1) % FLIGHTS.length];
      dispatch(
        setSelectedFlight({
          onward: flight,
          return: returnFlight,
          tripType,
          departDate,
          returnDate,
        })
      );
    } else {
      dispatch(
        setSelectedFlight({
          ...flight,
          tripType,
          departDate,
        })
      );
    }
    // Single click navigates for both trip types
    history.push('/flight-booking');
  };

  return (
    <div className="flight-search">
      <h1>Search Flights</h1>

      <form onSubmit={handleSearch} className="search-form">
        <div className="trip-type">
          <label>
            <input
              type="radio"
              name="tripType"
              value="oneway"
              checked={tripType === 'oneway'}
              onChange={(e) => setTripType(e.target.value)}
            />
            One Way
          </label>
          <label>
            <input
              type="radio"
              name="tripType"
              value="roundtrip"
              checked={tripType === 'roundtrip'}
              onChange={(e) => setTripType(e.target.value)}
            />
            Round Trip
          </label>
        </div>

        <select value={from} onChange={(e) => setFrom(e.target.value)} required>
          <option value="">From</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select value={to} onChange={(e) => setTo(e.target.value)} required>
          <option value="">To</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={departDate}
          onChange={(e) => setDepartDate(e.target.value)}
          required
        />

        {isRoundTripActive && (
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
        )}

        <button type="submit" className="search-flights-btn">
          Search
        </button>
      </form>

      {searched && (
        <div className="flight-results">
          {flights.length === 0 ? (
            <p className="no-flights">No flights available</p>
          ) : (
            <ul>
              {flights.map((flight, index) => (
                <li key={flight.id} className="flight-item">
                  <span className="flight-name">{flight.name}</span>
                  <span className="flight-route">
                    {flight.from} to {flight.to}
                  </span>
                  <span className="flight-time">
                    {flight.departure} - {flight.arrival}
                  </span>
                  <button
                    className="book_flight"
                    onClick={() => handleBook(flight, index)}
                  >
                    RS. {flight.price}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;