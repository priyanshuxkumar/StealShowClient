import React from "react";
import { Card, CardContent } from "./ui/card"
import { StarIcon } from "lucide-react"

interface EventCardProps {
  event : {
    id: string;
    name: string;
    category: string;
    thumbnail: string;
  }
  navigateToEventView: () => void;
}

const EventCard: React.FC<EventCardProps> = ({event , navigateToEventView}) => {
  return (
    <Card onClick={navigateToEventView} className="w-56 overflow-hidden cursor-pointer">
      <div className="relative">
        <img
          src={event?.thumbnail}
          alt="Event Poster"
          className="w-full h-auto"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
          <span className="text-lg font-semibold">6.7/10</span>
          <span className="text-sm text-gray-400 ml-2">7.3K Votes</span>
        </div>
        <p className="text-lg">{event?.name}</p>
        <p className="text-gray-500">{event?.category}</p>
      </CardContent>
    </Card>
  )
}

export default EventCard;