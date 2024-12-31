import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of your booking data
interface BookingDetails {
  row?: string[];
  seatNumber?: string[];
  price: number;
  seatId?: string[];
}

// Define the default values for your context
const defaultBooking: BookingDetails = {
  row: [],
  seatNumber: [],
  price: 0,
  seatId: [],
};

export const BookingContext = createContext<{
  bookingDetails: BookingDetails;
  setBookingDetails: React.Dispatch<React.SetStateAction<BookingDetails>>;
}>({
  bookingDetails: defaultBooking,
  setBookingDetails: () => {},
});

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(defaultBooking);

  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingDetails }}>
      {children}
    </BookingContext.Provider>
  );
};