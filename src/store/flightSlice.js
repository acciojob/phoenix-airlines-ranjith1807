import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: null,
  selectedFlight: null,
  bookingDetails: null,
};

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedFlight: (state, action) => {
      state.selectedFlight = action.payload;
    },
    setBookingDetails: (state, action) => {
      state.bookingDetails = action.payload;
    },
    clearBooking: (state) => {
      state.searchQuery = null;
      state.selectedFlight = null;
      state.bookingDetails = null;
    }
  },
});

export const { setSearchQuery, setSelectedFlight, setBookingDetails, clearBooking } = flightSlice.actions;
export default flightSlice.reducer;