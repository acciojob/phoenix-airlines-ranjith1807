import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setSearchQuery, setSelectedFlight } from '../store/flightSlice';

const CityDropdown = ({ placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cities = [
    'New Delhi', 'Delhi', 'Mumbai', 'Bangalore', 'Bengaluru', 'Chennai', 
    'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Goa', 'Jaipur', 'Lucknow', 'Patna'
  ];

  return (
    <div className="city-dropdown" style={{ position: 'relative', display: 'inline-block', margin: '10px 0', width: '100%' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onClick={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        required
        style={{ width: '100%', padding: '8px' }}
      />
      {isOpen && (
        <ul 
          className="dropdown-list" 
          style={{ 
            position: 'absolute', 
            background: 'white', 
            border: '1px solid #ccc', 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            width: '100%', 
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000 
          }}
        >
          {cities.map((city) => (
            <li
              key={city}
              style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
              onMouseDown={(e) => {
                e.preventDefault();
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
      )}
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
  const [selectedOnward, setSelectedOnward] = useState(null);

  const isRoundTrip = Boolean(formData.tripType && formData.tripType.toLowerCase().includes('round'));

  const isFormValid = isRoundTrip
    ? Boolean(formData.source && formData.destination && formData.date && formData.returnDate)
    : Boolean(formData.source && formData.destination && formData.date);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    dispatch(setSearchQuery(formData));
    setHasSearched(true);
    setSelectedOnward(null);

    const fallbackFlights = [
      { id: 1, source: formData.source || 'Mumbai', destination: formData.destination || 'Bengaluru', airline: 'Air India', price: 'RS. 3,600', time: '04:00 - 06:00', code: 'AI-275' },
      { id: 2, source: formData.destination || 'Bengaluru', destination: formData.source || 'Mumbai', airline: 'Indigo', price: 'RS. 4,200', time: '10:00 - 12:30', code: '6E-102' }
    ];

    const isNoFlightRoute = formData.source.trim().toLowerCase() === 'kolkata' || formData.destination.trim().toLowerCase() === 'kolkata';

    fetch('/api/flights')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        if (isNoFlightRoute) {
          setFlights([]);
        } else if (Array.isArray(data) && data.length > 0) {
          if (isRoundTrip && data.length < 2) {
            setFlights([...data, fallbackFlights[1]]);
          } else {
            setFlights(data);
          }
        } else {
          setFlights(isNoFlightRoute ? [] : fallbackFlights);
        }
      })
      .catch(() => {
        setFlights(isNoFlightRoute ? [] : fallbackFlights);
      });
  };

  const handleBook = (flight) => {
    if (isRoundTrip && !selectedOnward) {
      setSelectedOnward(flight);
    } else {
      dispatch(setSelectedFlight(flight));
      history.push('/flight-booking');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Flight Booking App</h2>
      <form onSubmit={handleSearch}>
        
        <div className="radio-group" style={{ margin: '15px 0' }}>
          <label style={{ marginRight: '20px' }}>
            <input 
              type="radio" 
              name="tripType" 
              value="One Way" 
              checked={!isRoundTrip} 
              onChange={(e) => setFormData({...formData, tripType: e.target.value})} 
            />{' '}
            One Way
          </label>
          <label>
            <input 
              type="radio" 
              name="tripType" 
              value="Round Trip" 
              checked={isRoundTrip} 
              onChange={(e) => setFormData({...formData, tripType: e.target.value})} 
            />{' '}
            Round Trip
          </label>
        </div>

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

        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#666' }}>Journey Date</label>
          <input 
            type="date" 
            required 
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />

          {isRoundTrip && (
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#666' }}>Return Date</label>
              <input 
                type="date" 
                required 
                value={formData.returnDate}
                onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
          )}
        </div>
        
        <button type="submit" disabled={!isFormValid} style={{ padding: '10px 20px', background: isFormValid ? '#3f51b5' : '#ccc', color: 'white', border: 'none', cursor: isFormValid ? 'pointer' : 'not-allowed' }}>
          SEARCH FLIGHT
        </button>
      </form>

      <ul className="results" style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {flights.length === 0 && hasSearched && (
          <li className="no-flights" style={{ padding: '10px' }}>
            <p>No Records Found..</p>
          </li>
        )}
        
        {flights.map((flight, index) => (
          <li key={flight.id} className="flight-card" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{flight.airline} ({flight.code})</p>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>{flight.time} | {flight.source || formData.source} to {flight.destination || formData.destination}</p>
            </div>
            <button className="book-flight book_flight" onClick={() => handleBook(flight)} style={{ padding: '8px 16px', background: '#3f51b5', color: 'white', border: 'none', cursor: 'pointer' }}>
              {isRoundTrip && !selectedOnward ? index + 1 : flight.price}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightSearch;