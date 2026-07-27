import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setBookingDetails } from '../store/flightSlice';

const FlightBooking = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedFlight = useSelector((state) => state.flight.selectedFlight);

  const isRoundTrip = selectedFlight && selectedFlight.onward && selectedFlight.return;
  const flight = isRoundTrip
    ? selectedFlight.onward
    : selectedFlight || { airline: 'Air India', code: 'AI-275', price: 'RS. 3,600' };

  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!user.firstName.trim() || !user.lastName.trim() || !user.email.trim() || !user.phone.trim()) {
      setError('All Fields are mandatory');
      return;
    }

    dispatch(setBookingDetails(user));
    history.push('/confirmation');
  };

  return (
    <div>
      <h2>
        Booking Confirmation for Flight {flight.airline} ({flight.code})
        {isRoundTrip && ` / ${selectedFlight.return.airline} (${selectedFlight.return.code})`}
      </h2>

      {error && (
        <p className="error-message" style={{ color: 'red', margin: '10px 0', fontWeight: 'bold' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ margin: '10px 0' }}>
          <input
            type="text"
            placeholder="First Name *"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input
            type="text"
            placeholder="Last Name *"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input
            type="text"
            placeholder="Email ID *"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input
            type="text"
            placeholder="Mobile Number *"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
        </div>
        <button type="submit" onClick={handleSubmit}>CONFIRM BOOKING</button>
      </form>
    </div>
  );
};

export default FlightBooking;