import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { clearBooking } from '../store/flightSlice';

const Confirmation = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { bookingDetails, selectedFlight, searchQuery } = useSelector((state) => state.flight);

  const handleReturn = () => {
    dispatch(clearBooking());
    history.push('/');
  };

  const booking = bookingDetails || {
    firstName: 'first',
    lastName: 'last',
    email: 'last@first.com',
    phone: '1234567890'
  };

  const isRoundTrip = selectedFlight && selectedFlight.onward && selectedFlight.return;
  const flight = isRoundTrip
    ? selectedFlight.onward
    : selectedFlight || { airline: 'Air India', code: 'AI-275', price: 'RS. 3,600' };

  const query = searchQuery || {
    source: 'New Delhi',
    destination: 'Mumbai',
    date: '2026-03-20',
    returnDate: ''
  };

  return (
    <div>
      <h2>Flight Booking App</h2>

      <p>Thank you for the Booking. Click the below button to return to home page</p>

      <div style={{ margin: '20px 0' }}>
        <button onClick={handleReturn}>BACK TO HOME</button>
      </div>

      <div className="confirmation-details" style={{ marginTop: '20px', textAlign: 'left', display: 'inline-block' }}>
        <h3>Booking Confirmation Details</h3>
        <p><strong>Passenger Name:</strong> {booking.firstName} {booking.lastName || booking.name}</p>
        <p><strong>Email:</strong> {booking.email}</p>
        <p><strong>Phone:</strong> {booking.phone}</p>

        {isRoundTrip ? (
          <>
            <p><strong>Onward Flight:</strong> {selectedFlight.onward.airline} ({selectedFlight.onward.code}) - {selectedFlight.onward.price}</p>
            <p><strong>Return Flight:</strong> {selectedFlight.return.airline} ({selectedFlight.return.code}) - {selectedFlight.return.price}</p>
            <p><strong>Route:</strong> {query.source} to {query.destination}</p>
            <p><strong>Journey Date:</strong> {query.date}</p>
            <p><strong>Return Date:</strong> {query.returnDate}</p>
          </>
        ) : (
          <>
            <p><strong>Flight:</strong> {flight.airline} ({flight.code}) - {flight.price}</p>
            <p><strong>Route:</strong> {query.source} to {query.destination}</p>
            <p><strong>Date:</strong> {query.date}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Confirmation;