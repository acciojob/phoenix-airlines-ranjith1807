import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setBookingDetails } from '../store/flightSlice';

const FlightBooking = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedFlight = useSelector((state) => state.flight.selectedFlight);
  
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fix for Test 3: Must match exact wording expected by Cypress assertion
    if (!user.firstName || !user.lastName || !user.email || !user.phone) {
      setError('All Fields are mandatory');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(user.email)) {
      setError('Please enter a valid email.');
      return;
    }

    dispatch(setBookingDetails(user));
    history.push('/confirmation');
  };

  if (!selectedFlight) return <p>Please select a flight first.</p>;

  return (
    <div>
      <h2>Booking Confirmation for Flight {selectedFlight.airline} ({selectedFlight.code})</h2>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ margin: '10px 0' }}>
          <input 
            type="text" 
            placeholder="First Name *" 
            value={user.firstName} 
            onChange={(e) => {
              setUser({...user, firstName: e.target.value});
              if (error) setError('');
            }} 
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input 
            type="text" 
            placeholder="Last Name *" 
            value={user.lastName} 
            onChange={(e) => {
              setUser({...user, lastName: e.target.value});
              if (error) setError('');
            }} 
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input 
            type="text" 
            placeholder="Email ID *" 
            value={user.email} 
            onChange={(e) => {
              setUser({...user, email: e.target.value});
              if (error) setError('');
            }} 
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input 
            type="text" 
            placeholder="Mobile Number *" 
            value={user.phone} 
            onChange={(e) => {
              setUser({...user, phone: e.target.value});
              if (error) setError('');
            }} 
          />
        </div>
        <button type="submit">CONFIRM BOOKING</button>
      </form>
    </div>
  );
};

export default FlightBooking;