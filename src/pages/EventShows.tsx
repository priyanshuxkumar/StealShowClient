import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, Info } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { formatDate, formatEventDate, formatEventShowTime} from '../utils/timeServices';
import AppBar from '../components/Appbar'

interface VenueProps {
  id: string;
  date: Date;
  showtime: Date;
  totalSeats: number;
  event: {
    name: string;
    category: string;
    langauge: string;
  };
  venue: {
    id: string;
    name: string;
    city: string;
    address: string;
  };
}


export default function EventShows() {
  const {id , location} = useParams();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  
  const date = selectedDate === today  ? today : new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
  const [venues , setVenues] = useState<VenueProps[]>();

  const fetchEventShowsTicketDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/venue/get/event/${id}/${location}/${selectedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200) {
        setVenues(response.data.venues);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id, location, selectedDate]);

  useEffect(() => {
    fetchEventShowsTicketDetails();
  },[fetchEventShowsTicketDetails]);

  const handleDateChange = (direction:string) => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1); // Decrement by 1 day
    } else if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 1); // Increment by 1 day
    }
    setSelectedDate(formatDate(newDate));
  };

  return (
    <>
    <AppBar/>
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{venues && venues[0]?.event?.name}</h1>
      <div className="flex items-center gap-2 mb-4">
        <span className="border border-gray-300 rounded px-2 py-1 text-sm">{venues && venues[0]?.event?.category}</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 mx-4">
          <Button onClick={() => handleDateChange('prev')} variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>

            {venues && venues.map((item , i) => (
              <Button
                key={i}
                variant={selectedDate === formatDate(item?.date) ? "default" : "outline"}
                className="h-8 w-16"
                onClick={() => setSelectedDate(formatDate(item?.date))}
              >
                <div className="text-center">
                  <div className="font-semibold">{formatEventDate(item?.date)}</div>
                </div>
              </Button>
            ))}
          <Button onClick={() => handleDateChange('next')} variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>AVAILABLE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>FAST FILLING</span>
        </div>
      </div>


      {venues && venues?.map((item) => (
        <Card key={item.id} className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <h2 className="text-xl font-semibold">{item?.venue.name} , <span className='text-xl font-semibold'>{item?.venue.address}</span></h2>
                <span className="text-sm text-gray-500">{item?.venue.city}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4 mr-2" />
                INFO
              </Button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>M-Ticket</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>Food & Beverage</span>
              </div>
            </div>
            <div onClick={()=> navigate(`/buy-tickets/${item?.event.name}/${item?.venue.id}/${item?.id}/${date}/seatlayout`)} className="flex flex-wrap gap-4">
              {/* {theater.showtimes.map((showtime, idx) => ( */}
                <Button variant="outline">{formatEventShowTime(item?.showtime) || ''}</Button>
              {/* ))} */}
            </div>
            <div className="mt-4 text-sm text-orange-500">Cancellable</div>
          </CardContent>
        </Card>
      ))}
    </div>
    </>
  )
}