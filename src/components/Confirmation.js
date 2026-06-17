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

  if (!bookingDetails) return <p>No booking found.</p>;

  return (
    <div>
      <h2>Booking Confirmed!</h2>
      <div className="confirmation-details">
        <h3>Passenger Details</h3>
        <p>Name: {bookingDetails.name}</p>
        <p>Email: {bookingDetails.email}</p>
        
        <h3>Flight Details</h3>
        <p>Airline: {selectedFlight.airline}</p>
        <p>Route: {searchQuery.source} to {searchQuery.destination}</p>
        <p>Date: {searchQuery.date}</p>
      </div>
      
      {/* Cypress requires a generic button here */}
      <button onClick={handleReturn}>Return to Home</button>
    </div>
  );
};

export default Confirmation;