import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useBooking } from '../context/useBooking'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDate, formatEventShowTime } from '../utils/timeServices'
import { fetchCurrentUserFn } from '../utils/helperFn'


interface SeatBookingDataProps {
  date: Date;
  event: {
    language: string;
    name: string;
  };
  showtime: Date;
  venue: {
    name: string;
    address: string;
    city: string;
  };
}

interface User {
  name: string;
  email : string
}

export default function MovieTicketPayment() {
const { eventVenueId } = useParams();
const _token = localStorage.getItem('_token_');
const navigate = useNavigate();

//Fetch current logged in user 
const token = localStorage.getItem('_token_');

const [currentUser , setCurrentUser] = useState<User | null>(null);
const fetchCurrentUser = useCallback(async() => {
  const data = await fetchCurrentUserFn(token as string);
  setCurrentUser(data);
},[token]);

//Refresh Funtionality : If user refresh redirect to EventPage:


const [isContactOpen, setIsContactOpen] = useState(true)
const [isPromoOpen, setIsPromoOpen] = useState(false)
const [isPaymentOpen, setIsPaymentOpen] = useState(true)

const [seatBookingData, setSeatBookingData] = useState<SeatBookingDataProps| null>(null);

const {bookingDetails} = useBooking();


const fetchBookingDetails = useCallback(async() => {
  try {
    const res = await axios.get(`/api/v1/seat/get-booking-details/${eventVenueId}`, {
        headers: {
            'Content-Type': 'application/json',
        }
      })
    if(res.status == 200){
        setSeatBookingData(res.data);
    }
  } catch (error) {
    console.error(error)
  }   
},[eventVenueId]);

const updateSeatStatus = useCallback(async() => {
  try {
    const res = await axios.post(`/api/v1/seat/update-seat-status`, {
      eventVenueId: eventVenueId,
      seatsId: bookingDetails.seatId
    })
    if(res.status == 200){
      console.log("Seat Booked successfully!");
      navigate('/explore/Kanpur')
    }
  } catch (error) {
   console.error(error);
  }
},[bookingDetails.seatId, eventVenueId, navigate]);

//Create Razorpay orderId -
const createOrderId = useCallback(async () => {
  try {
    const res = await axios.post(
      "/api/v1/payment/create-order",
      {
        amount: bookingDetails.price + bookingDetails.price / 5,
        currency: "INR",
      }
    );
    
    if (res.status == 200) {
      const options = {
        key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "ShowSteal",
        description: "Purchase Ticket",
        order_id: res.data.id,
        prefill: {
          name: currentUser?.name,
          email: currentUser?.email,
          contact: '9760262956'
        },
        theme: {
          color: '#F37254'
        },
        handler: async function (response){
          // Send the payment details to your backend to validate the payment
          const paymentValidationResponse = await axios.post(
            "/api/v1/payment/verify",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (paymentValidationResponse.status === 200) {
            updateSeatStatus()
            alert("Payment successful!");
          }
        },
        modal: {
          ondismiss: function () {
            alert("Payment process cancelled!");
          },
        }
      }
    
       // Instantiate Razorpay and open the payment gateway
      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  } catch (error) {
    console.error(error);
  }
}, [bookingDetails.price, currentUser?.email, currentUser?.name, updateSeatStatus]);



useEffect(()=> {
    fetchBookingDetails();
    fetchCurrentUser();
},[fetchBookingDetails, fetchCurrentUser])

return (
  <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
    <div className="w-full md:w-2/3 space-y-4">
      {!_token && 
      <Collapsible open={isContactOpen} onOpenChange={setIsContactOpen}>
        <CollapsibleTrigger className="w-full bg-red-500 text-white p-3 flex justify-between items-center">
          Share your Contact Details
          {isContactOpen ? <ChevronUp /> : <ChevronDown />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white shadow-md">
          <div className="flex gap-2">
            <Input placeholder="Email Address" className="flex-grow" />
            <Button className="bg-red-500 hover:bg-red-600">CONTINUE</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      }

      <Collapsible open={isPromoOpen} onOpenChange={setIsPromoOpen}>
        <CollapsibleTrigger className="w-full bg-gray-200 text-gray-700 p-3 flex justify-between items-center">
          Unlock offers or Apply Promocodes
          {isPromoOpen ? <ChevronUp /> : <ChevronDown />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white shadow-md hover:bg-slate-50">
          FIRST100
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <CollapsibleTrigger className="w-full bg-red-500 text-white p-3 flex justify-between items-center">
          Payment options
          {isPaymentOpen ? <ChevronUp /> : <ChevronDown />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white shadow-md">
          <div className="space-y-4">
            <div className="font-semibold">Pay by any UPI App</div>
            <div className="grid grid-cols-2 gap-4">
              {['Razorpay', 'CRED', 'Google Pay', 'Amazon Pay', 'BHIM', 'Paytm', 'PhonePe', 'Other UPI'].map((app) => (
                <div key={app} className="flex items-center gap-2">
                  <input type="radio" id={app} name="paymentApp" disabled={app != 'Razorpay'}/>
                  <label htmlFor={app}>{app}</label>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div onClick={createOrderId}>
        <Button className="w-20 bg-red-500 hover:bg-red-600">Pay now</Button>
      </div>
    </div>

    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>ORDER SUMMARY</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div>
            <h2 className="font-bold">{seatBookingData?.event.name}</h2>
            <p className="text-sm text-gray-600">{seatBookingData?.event.language}</p>
            <p className="text-sm text-gray-600">{seatBookingData?.venue.name}</p>
            <p className="text-sm text-gray-600">{seatBookingData?.venue.address}</p>
            <p className="text-sm text-gray-600">M-Ticket</p>
            <p className="text-sm font-semibold">{bookingDetails?.row?.map(item => item)} {bookingDetails?.seatNumber?.map(item => item)}</p>
            <p className="text-sm font-semibold">{seatBookingData && formatDate(seatBookingData?.date)}</p>
            <p className="text-sm font-semibold">{seatBookingData && formatEventShowTime(seatBookingData?.showtime)}</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-bold">{bookingDetails?.seatNumber?.length}</span>
            <p className="text-sm text-gray-600">Ticket</p>
          </div>
        </div>
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span className="font-semibold">Rs. {bookingDetails.price}</span>
          </div>
          <div className="flex justify-between">
            <span>+ Convenience fees</span>
            <span className="font-semibold">Rs. {bookingDetails && (bookingDetails?.price/5)}</span>
          </div>
          <Button variant="link" className="text-red-500 p-0">Show tax breakup ▼</Button>
        </div>
        <div className="bg-yellow-100 p-4 rounded-md flex justify-between items-center">
          <span>Amount Payable</span>
          <span className="text-xl font-bold">Rs. {bookingDetails && (bookingDetails?.price +  bookingDetails?.price/5)}.00</span>
        </div>
      </CardContent>
    </Card>
  </div>
  )
}