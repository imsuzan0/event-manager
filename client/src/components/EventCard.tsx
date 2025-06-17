import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Phone, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";
import { useEvent } from "@/contexts/event-context";

interface EventCardProps {
  event: Event;
  onRefresh?: () => void;
}

const EventCard = ({ event, onRefresh }: EventCardProps) => {
  const navigate = useNavigate();
  const { getEventLikes, getEventComments } = useEvent();
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  const fetchCounts = useCallback(async () => {
    try {
      const [likes, comments] = await Promise.all([
        getEventLikes(event._id),
        getEventComments(event._id),
      ]);

      setLikesCount(Array.isArray(likes) ? likes.length : 0);
      setCommentsCount(Array.isArray(comments) ? comments.length : 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
      setLikesCount(0);
      setCommentsCount(0);
    }
  }, [event._id, getEventLikes, getEventComments]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const handleCardAction = (action: "like" | "comment") => {
    navigate(
      `/events/${event._id}${action === "comment" ? "#comments-section" : ""}`
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={event.image_urls?.[0] || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          <div className="flex items-center text-white/80 mt-1">
            <span className="text-sm px-2 py-1 bg-teal-500/80 rounded-full">
              {event.tag}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.desc}</p>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {new Date(event.date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.phone_number}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="flex space-x-4">
            <button
              onClick={() => handleCardAction("like")}
              className="flex items-center text-gray-500 hover:text-teal-500 transition-colors"
            >
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-sm">{likesCount}</span>
            </button>

            <button
              onClick={() => handleCardAction("comment")}
              className="flex items-center text-gray-500 hover:text-teal-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{commentsCount}</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/events/${event._id}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
