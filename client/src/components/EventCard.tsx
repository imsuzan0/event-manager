import { useEffect, useCallback, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Phone, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/Event";
import { useEvent } from "@/contexts/event-context";
import { useAuth } from "@/hooks/use-auth";

interface EventCardProps {
  event: Event;
  onRefresh?: () => void;
}

const EventCard = memo(({ event, onRefresh }: EventCardProps) => {
  const navigate = useNavigate();
  const { getEventLikes, getEventComments, toggleLike } = useEvent();
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const { user } = useAuth();

  // Only fetch initial state once when component mounts
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const [likes, comments] = await Promise.all([
          getEventLikes(event._id),
          getEventComments(event._id),
        ]);

        if (Array.isArray(likes)) {
          setLikesCount(likes.length);
          setHasLiked(
            user ? likes.some((like) => like.user_id._id === user.id) : false
          );
        }

        if (Array.isArray(comments)) {
          setCommentsCount(comments.length);
        }
      } catch (error) {
        console.error("Error fetching initial state:", error);
      }
    };

    fetchInitialState();
  }, [event._id, user?.id]); // Only re-run if event ID or user ID changes

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/signup");
      return;
    }

    if (isLiking) return;

    try {
      setIsLiking(true);

      // Optimistic update
      setHasLiked((prev) => !prev);
      setLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1));

      // Server update
      await toggleLike(event._id);
    } catch (error) {
      // Revert on error
      console.error("Error toggling like:", error);
      setHasLiked((prev) => !prev);
      setLikesCount((prev) => (hasLiked ? prev + 1 : prev - 1));
    } finally {
      setIsLiking(false);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    if (user) {
      navigate(`/events/${event._id}`);
    } else {
      navigate("/signup");
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/signup");
      return;
    }

    navigate(`/events/${event._id}#comments-section`);
  };

  return (
    <div className="bg-gradient-to-b from-white to-indigo-50/50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src={event.image_urls?.[0] || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-52 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-full shadow-md">
                {event.tag}
              </span>
              <h3 className="text-2xl font-bold text-white">{event.title}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {event.desc}
        </p>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-3 text-indigo-600" />
            <span className="text-sm">
              {new Date(event.date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-3 text-indigo-600" />
            <span className="text-sm">{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Phone className="h-4 w-4 mr-3 text-indigo-600" />
            <span className="text-sm">{event.phone_number}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-indigo-100">
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                hasLiked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
              }`}
              disabled={isLiking}
            >
              <Heart className={`h-5 w-5 ${hasLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            <button
              onClick={handleComment}
              className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{commentsCount}</span>
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleView}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
});

EventCard.displayName = "EventCard";

export default EventCard;
