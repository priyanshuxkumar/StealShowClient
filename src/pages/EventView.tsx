import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { StarIcon, Share2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import AppBar from "../components/Appbar";

interface EventViewProps {
  id: string;
  name: string;
  host: string;
  description: string;
  ageRestriction: number;
  category: string;
  thumbnail : string;
  headerImage: string;
  duration: number;
  langauge: string;
  createdAt: Date;
}

const EventView = () => {
  const {location, id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventViewProps | undefined>();

  const fetchSingleEvent = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/v1/event/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.status == 200) {
        setEvent(response.data.event);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchSingleEvent();
  }, [fetchSingleEvent]);

  return (
    <>
    <AppBar/>
    <div className="w-full">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img
          src={event?.headerImage}
          alt="Tumbbad movie banner"
          className="absolute w-full inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-5xl font-bold mb-2">{event?.name}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="font-semibold">8.4/10</span>
              <span className="text-sm ml-1">(90.4K Votes)</span>
            </div>
            <Button variant="outline" size="sm" className="text-black">
              Rate now
            </Button>
          </div>
          <div className="flex space-x-2 mb-4">
            <Badge>2D</Badge>
            <Badge>{event?.langauge}</Badge>
          </div>
          <p className="text-sm mb-4">
            1h 53m • {event?.category} • 12 Oct, 2018
          </p>
          <Button onClick={()=> navigate(`/buy-tickets/${event?.name}/${location}/${event?.id}`)} className="bg-pink-500 hover:bg-pink-600 text-white">
            Book tickets
          </Button>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4"
        >
          <Share2Icon className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">About the event</h2>
        <p className="text-gray-600 mb-8">{event?.description}</p>
        <h2 className="text-2xl font-bold mb-4">Host</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <Avatar className="w-24 h-24 rounded-full mx-auto mb-2 object-fill">
              <AvatarImage src="" />
              <AvatarFallback>XY</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">{event?.host}</h3>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default EventView;
