import { useContext } from 'react';
import { BookingContext } from './BookingDetailsContext';

export const useBooking = () => {
  return useContext(BookingContext);
};
