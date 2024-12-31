import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import axios from "axios";
import { useParams } from "react-router-dom";
import PaymentSummary from "../components/Payment";
import DetailAppbar, { EventDetailsProps } from "../components/DetailAppbar";

interface Seat {
  status: string;
  seatNumber: string;
  price: number;
}

interface SeatLayoutProps {
  row: string;
  seats: Seat[];
}

export interface SelectedSeatProps {
  row : string;
  seatNumber: string;
  price: number;
}

export default function SeatSelection() {
  const { venueId , eventVenueId } = useParams();
  const [seatLayout, setSeatLayout] = useState<SeatLayoutProps[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeatProps[]>([]);

  const [eventDetails , setEventDetails] = useState<EventDetailsProps>();

  const fetchSeatLayout = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/v1/venue/get/seatlayout/${venueId}/${eventVenueId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status == 200) {
        setEventDetails(res.data.eventDetails);
        setSeatLayout(res.data.seatLayout);
      }
    } catch (error) {
      console.error(error);
    }
  }, [eventVenueId, venueId]);

  useEffect(() => {
    fetchSeatLayout();
  }, [fetchSeatLayout]);

  const handleSeatClick = useCallback((row: string, seatNumber: string , price: number) => {
    setSeatLayout((prevRows) =>
      prevRows.map((item) =>
        item.row === row
          ? {
              ...item,
              seats: item.seats.map((seat) =>
                seat.seatNumber === seatNumber
                  ? {
                      ...seat,
                      status:
                        seat.status === "available" ? "selected" : "available",
                    }
                  : seat
              ),
            } : item
      )
    );
    setSelectedSeats(prev => [...prev, { row, seatNumber, price }]);
  },[]);

  const [isPaymentCompVisible , setIsPaymentCompVisible] = useState(false);
  const handlePaymentComp = () => {
    setIsPaymentCompVisible(!isPaymentCompVisible);
  }

  //Calculate price of Seats -
  const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  return (
    <>
    {/* @ts-ignore */}
  
    <DetailAppbar eventDetails={eventDetails}/>

    <div className=" flex justify-center items-center h-screen">
      <div className="p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Select Your Seats
        </h2>

        <div className="mb-4">
          {seatLayout &&
            seatLayout?.map((item, index) => (
              <div key={index} className="flex items-center mb-1">
                <span className="w-6 text-center font-semibold">{item.row}</span>
                {item.seats.map((seat) => (
                  <Button
                    key={seat.seatNumber}
                    className={`w-7 h-7 m-1 text-xs ${
                      seat.status === "available"
                        ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
                        : seat.status === "selected"
                        ? "bg-green-500 border border-gray-300 text-white hover:bg-green-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={() => handleSeatClick(item.row, seat?.seatNumber , seat?.price)}
                    disabled={seat.status === "BOOKED"}
                  >
                    {seat.seatNumber}
                  </Button>
                ))}
              </div>
            ))}
        </div>

        <div className="flex justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-white border border-gray-300 mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 mr-2"></div>
            <span>Sold</span>
          </div>
        </div>
        {selectedSeats.length > 0 && 
          <div className=" flex justify-center items-center w-full">
            <Button onClick={handlePaymentComp} className="w-1/4 mt-4">Price: {totalPrice}.00</Button>
          </div>
        }
      </div>
    </div>
    {isPaymentCompVisible && 
      <div className="fixed top-0 left-0 backdrop-blur-sm z-50">
        <PaymentSummary selectedSeats={selectedSeats as [SelectedSeatProps]} eventVenueId={eventVenueId as string} isPaymentCompVisible={isPaymentCompVisible} setIsPaymentCompVisible={setIsPaymentCompVisible}/>
      </div>
    }
    </>
  );
};
