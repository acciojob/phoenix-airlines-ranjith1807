import { configureStore } from '@reduxjs/toolkit';
import flightReducer from './flightSlice';

export const store = configureStore({
  reducer: {
    flight: flightReducer,
  },
});