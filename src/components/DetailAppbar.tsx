import { ChevronLeft, X } from "lucide-react";
import { formatDate, formatEventShowTime } from "../utils/timeServices";

export interface EventDetailsProps {
  eventDetails: {
    event: {
      name: string;
    };
    venue: {
      address: string;
      name: string;
    };
    date: Date;
    showtime: Date;
  };
}

const DetailAppbar = ({ eventDetails }: EventDetailsProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 sticky top-0 left-0">
      <ChevronLeft className="w-6 h-6 text-gray-600" />
      <div className="flex-1 mx-4">
        <h1 className="text-base font-semibold text-gray-800 truncate">
          {eventDetails?.event?.name}
        </h1>
        <p className="text-xs text-gray-500 truncate">
          {eventDetails?.venue?.name} {eventDetails?.venue.address} |{" "}
          {formatDate(eventDetails?.date)}{" "}
          {formatEventShowTime(eventDetails?.showtime)}
        </p>
      </div>
      <button className="flex items-center px-2 py-1 text-xs font-medium text-gray-600">
        <X className="w-6 h-6 ml-1" />
      </button>
    </div>
  );
};

export default DetailAppbar;
