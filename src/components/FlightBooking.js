import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setBookingDetails } from '../store/flightSlice';

const FlightBooking = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedFlight = useSelector((state) => state.flight.selectedFlight);
  
  const [user, setUser] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.phone) {
      setError('All fields are required.');
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
      <h2>Book Flight</h2>
      <p>Booking: {selectedFlight.airline} for {selectedFlight.price}</p>
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        {/* Cypress looks for input[type='text'] */}
        <input type="text" placeholder="Full Name" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
        <input type="text" placeholder="Email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} />
        <input type="text" placeholder="Phone Number" value={user.phone} onChange={(e) => setUser({...user, phone: e.target.value})} />
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
};

export default FlightBooking;