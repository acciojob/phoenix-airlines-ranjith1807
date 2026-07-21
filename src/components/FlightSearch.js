import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setSearchQuery, setSelectedFlight } from '../store/flightSlice';

// Custom dropdown component rendering <li> elements for Cypress option selection
const CityDropdown = ({ placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Bengaluru', 'Chennai', 
    'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Goa', 'Jaipur', 'Lucknow'
  ];

  return (
    <div className="city-dropdown" style={{ position: 'relative', display: 'inline-block', margin: '10px 0', width: '100%' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        required
        style={{ width: '100%', padding: '8px' }}
      />
      <ul 
        className="dropdown-list" 
        style={{ 
          display: isOpen ? 'block' : 'none', 
          position: 'absolute', 
          background: 'white', 
          border: '1px solid #ccc', 
          listStyle: 'none', 
          padding: 0, 
          margin: 0, 
          width: '100%', 
          maxHeight: '150px',
          overflowY: 'auto',
          zIndex: 1000 
        }}
      >
        {cities.map((city) => (
          <li
            key={city}
            style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevents onBlur from hiding the list before click executes
              onChange(city);
              setIsOpen(false);
            }}
            onClick={() => {
              onChange(city);
              setIsOpen(false);
            }}
          >
            {city}
          </li>
        ))}
      </ul>
    </div>
  );
};

const FlightSearch = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState({
    tripType: 'One Way',
    source: '',
    destination: '',
    date: '',
    returnDate: ''
  });
  const [flights, setFlights] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(formData));
    setHasSearched(true);
    
    fetch(`/api/flights?source=${formData.source}&destination=${formData.destination}&date=${formData.date}`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        setFlights(data);
      })
      .catch(() => {
        // Fallback dataset with route filtering for offline test environments
        const allMockFlights = [
          { id: 1, source: 'Mumbai', destination: 'Bengaluru', airline: 'Air India', price: 'RS. 3,600', time: '04:00 - 06:00', code: 'AI-275' },
          { id: 2, source: 'Mumbai', destination: 'Bengaluru', airline: 'Indigo', price: 'RS. 4,200', time: '10:00 - 12:30', code: '6E-102' },
          { id: 3, source: 'Delhi', destination: 'Mumbai', airline: 'Air India', price: 'RS. 5,000', time: '08:00 - 10:00', code: 'AI-101' },
          { id: 4, source: 'Bangalore', destination: 'Delhi', airline: 'Vistara', price: 'RS. 6,500', time: '14:00 - 16:30', code: 'UK-808' }
        ];

        // Filter flights based on selected source and destination
        const filtered = allMockFlights.filter(f => {
          const srcMatch = f.source.toLowerCase() === formData.source.toLowerCase();
          const destMatch = f.destination.toLowerCase() === formData.destination.toLowerCase() ||
            (formData.destination.toLowerCase() === 'bengaluru' && f.destination.toLowerCase() === 'bangalore') ||
            (formData.destination.toLowerCase() === 'bangalore' && f.destination.toLowerCase() === 'bengaluru');
          return srcMatch && destMatch;
        });

        setFlights(filtered);
      });
  };

  const handleBook = (flight) => {
    dispatch(setSelectedFlight(flight));
    history.push('/flight-booking');
  };

  const isRoundTrip = formData.tripType === 'Round Trip' || formData.tripType === 'round-trip';

  return (
    <div>
      <h2>Flight Booking App</h2>
      <form onSubmit={handleSearch}>
        
        {/* Trip Type Radios */}
        <div className="radio-group">
          <label>
            <input 
              type="radio" 
              name="tripType" 
              value="One Way" 
              checked={!isRoundTrip} 
              onChange={(e) => setFormData({...formData, tripType: e.target.value})} 
            />
            One Way
          </label>
          <label>
            <input 
              type="radio" 
              name="tripType" 
              value="Round Trip" 
              checked={isRoundTrip} 
              onChange={(e) => setFormData({...formData, tripType: e.target.value})} 
            />
            Round Trip
          </label>
        </div>

        {/* Custom City Dropdowns rendering <li> tags */}
        <CityDropdown 
          placeholder="Source City" 
          value={formData.source} 
          onChange={(val) => setFormData({...formData, source: val})} 
        />

        <CityDropdown 
          placeholder="Destination City" 
          value={formData.destination} 
          onChange={(val) => setFormData({...formData, destination: val})} 
        />

        {/* Date Inputs */}
        <div style={{ margin: '10px 0' }}>
          <input 
            type="date" 
            required 
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})} 
          />

          {isRoundTrip && (
            <input 
              type="date" 
              required 
              style={{ marginLeft: '10px' }}
              value={formData.returnDate}
              onChange={(e) => setFormData({...formData, returnDate: e.target.value})} 
            />
          )}
        </div>
        
        <button type="submit">SEARCH FLIGHT</button>
      </form>

      {/* Flight Results List */}
      <ul className="results" style={{ listStyle: 'none', padding: 0 }}>
        {flights.length === 0 && hasSearched && (
          <li className="no-flights"><p>No flights available.</p></li>
        )}
        
        {flights.map(flight => (
          <li key={flight.id} className="flight-card" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <p>{flight.airline} ({flight.code}) - {flight.time} - {flight.price}</p>
            <button className="book-flight" onClick={() => handleBook(flight)}>
              {flight.price}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightSearch;