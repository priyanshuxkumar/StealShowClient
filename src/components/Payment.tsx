
import { CheckCircle, Info } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import axios from 'axios';
import { SelectedSeatProps } from '../pages/SeatSelection';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/useBooking';

interface PaymentSummaryProps {
    eventVenueId: string;
    selectedSeats: [
        SelectedSeatProps
    ]
    isPaymentCompVisible: boolean;
    setIsPaymentCompVisible: (value: boolean) => void;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> =  ({eventVenueId, selectedSeats ,isPaymentCompVisible , setIsPaymentCompVisible}) => {
  const navigate = useNavigate();
  
  const {setBookingDetails} = useBooking(); 

  const totalSeatPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0)

  const handleSeatBook = async () => {
    try {
      const res = await axios.post(
        "/api/v1/seat/book-seat",
        {
          eventVenueId: eventVenueId,
          seats: selectedSeats,
        }
      );
      if (res.status == 200) {
        setBookingDetails({
          row: selectedSeats.map(item => item.row),
          seatNumber: selectedSeats.map(item => item.seatNumber),
          price: totalSeatPrice,
          seatId: res.data,
        })
        navigate(`/payment/${eventVenueId}`)
      }
    } catch (error) {
      // TODO:SHOW ERROR SEAT HAS BEEN BOOKED 
      console.error(error);
    }
  };
    return (
      <Dialog open={isPaymentCompVisible} onOpenChange={setIsPaymentCompVisible}>
        <DialogTrigger asChild>
          <Button>Book</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Card className="w-full max-w-md mx-auto border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-red-500">BOOKING SUMMARY</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="flex text-lg font-semibold">{selectedSeats.map(item => <p> <span>{item.row}</span><span>{item.seatNumber},</span></p>, )} (<span> {selectedSeats.length}Tickets</span>)</h2>
                </div>
                <span className="font-semibold">Rs. {totalSeatPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Convenience fees</span>
                </div>
                <span className="font-semibold">Rs. {totalSeatPrice / 5}.00</span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span>Sub total</span>
                <span>Rs.{totalSeatPrice + totalSeatPrice/5}</span>
              </div>
              <div className="bg-yellow-100 p-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Amount Payable</span>
                  <span>Rs.{totalSeatPrice + totalSeatPrice/5}</span>
                </div>
              </div>
              <p className="text-sm">Show the m-ticket QR Code on your mobile to enter the cinema.</p>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="flex items-center text-sm">
                <Info className="w-4 h-4 mr-2" />
                <span>By proceeding, I express my consent to complete this transaction.</span>
              </div>
              <Button onClick={handleSeatBook} className="w-full bg-red-500 hover:bg-red-600 text-white">
                TOTAL: Rs.{totalSeatPrice+ totalSeatPrice/5}.00 Proceed
              </Button>
              <p className="text-xs text-center text-gray-500">
                You can cancel the tickets 20 min(s) before the show. Refunds will be done according to <span className="text-red-500">Cancellation Policy</span>
              </p>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    )
  }
  

  export default PaymentSummary;
  