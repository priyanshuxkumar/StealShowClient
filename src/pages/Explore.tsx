import { useCallback, useEffect, useState } from "react";
import EventCard from "../components/Card";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "../components/Carousel";
import AppBar from "../components/Appbar";
import { fetchCurrentUserFn } from "../utils/helperFn";

interface EventData {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  onClick: () => void;
}

const Explore = () => {
  const navigate = useNavigate();
  const { location } = useParams();

  const token = localStorage.getItem('_token_');

  const fetchCurrentUser = useCallback(async() => {
    const data = await fetchCurrentUserFn(token as string);
    console.log(data);
  },[token]);

  const [events, setEvents] = useState<EventData[]>([]);
  const [loading , setLoading] = useState<boolean>(false);
  const [error , setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const events = await axios.get(
        `/api/v1/event/explore/${location}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (events.status == 200) {
        setEvents(events.data.events);
        setLoading(false);
      }
    } catch (error : unknown) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      setLoading(false);
    }finally{
      setLoading(false);
    }
  }, [location]);
 
  useEffect(() => {
    fetchEvents();
    fetchCurrentUser();
  }, [fetchCurrentUser, fetchEvents]);

  if(error){
    return <p>Something went wrong!</p>;
  }

  if(loading){
    return <p>Loading...</p>;
  }
  return (
    <>
    <AppBar/>
    <div className="w-full h-screen px-20">
      <div className="h-[40%] w-full relative">
        <Carousel/>
      </div>
      {events.length > 0 ? (
        <div className="flex flex-col justify-center gap-5 flex-wrap">
          <h5 className="font-semibold text-3xl text-center py-4">Available Events</h5>
            <div className="flex justify-center gap-5 flex-wrap mb-10">
              {events?.map((item) => (
                  <EventCard  
                    key={item?.id}
                    event={item as EventData}
                    navigateToEventView={() => navigate(`/${location}/${item.id}`)}
                  />
              ))}
            </div>
        </div>
      ) : (
        events.length <= 0 && (
          <p className="text-center text-2xl mt-5">No event found!</p>
        )
      )}
    </div>
    </>
  );
};
export default Explore;