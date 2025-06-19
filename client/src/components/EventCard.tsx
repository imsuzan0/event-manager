import { useEffect, useCallback, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Phone,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Event } from "@/types/Event";
import { useEvent } from "@/contexts/event-context";
import { useAuth } from "@/hooks/use-auth";
import { format, isPast } from "date-fns";

interface EventCardProps {
  event: Event;
  onRefresh?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const EventCard = memo(
  ({
    event,
    onRefresh,
    onEdit,
    onDelete,
    showActions = false,
  }: EventCardProps) => {
    const navigate = useNavigate();
    const { getEventLikes, getEventComments, toggleLike } = useEvent();
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const { user } = useAuth();

    const formatEventDateTime = (dateStr: string) => {
      return format(new Date(dateStr), "PPPP 'at' p");
    };

    const isEventPast = isPast(new Date(event.date));

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
    }, [event._id, user, getEventLikes, getEventComments]); // Include all dependencies

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

    const handleShare = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        await navigator.share({
          title: event.title,
          text: event.desc,
          url: window.location.origin + `/events/${event._id}`,
        });
      } catch (err) {
        await navigator.clipboard.writeText(
          window.location.origin + `/events/${event._id}`
        );
        // You might want to show a toast notification here
      }
    };

    const handleActionClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    return (
      <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={event.image_urls?.[0] || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />

          {/* Actions Menu */}
          {showActions && (
            <div className="absolute top-4 right-4 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={handleActionClick}>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white/95 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl"
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit?.();
                    }}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 cursor-pointer"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start p-0 h-auto font-normal hover:bg-transparent"
                    >
                      <i className="ri-edit-line mr-2 text-lg" />
                      Edit Event
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete?.();
                    }}
                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start p-0 h-auto font-normal hover:bg-transparent text-red-600 hover:text-red-700"
                    >
                      <i className="ri-delete-bin-line mr-2 text-lg" />
                      Delete Event
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90">
            <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-full shadow-lg">
                    {event.tag}
                  </span>
                  {isEventPast ? (
                    <span className="inline-block px-3 py-1 bg-gray-600 text-white text-sm font-medium rounded-full">
                      Past Event
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
                      Upcoming
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                  {event.title}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 h-10">
            {event.desc}
          </p>

          <div className="space-y-4">
            <div className="flex items-center text-gray-600 group/item hover:text-indigo-600 transition-colors">
              <Calendar className="h-5 w-5 mr-3 transition-colors" />
              <span className="text-sm font-medium">
                {formatEventDateTime(event.date)}
              </span>
            </div>

            <div className="flex items-center text-gray-600 group/item hover:text-indigo-600 transition-colors">
              <MapPin className="h-5 w-5 mr-3 transition-colors" />
              <span className="text-sm font-medium">{event.location}</span>
            </div>

            <div className="flex items-center text-gray-600 group/item hover:text-indigo-600 transition-colors">
              <Phone className="h-5 w-5 mr-3 transition-colors" />
              <span className="text-sm font-medium">{event.phone_number}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  hasLiked
                    ? "text-pink-500"
                    : "text-gray-500 hover:text-pink-500"
                }`}
                disabled={isLiking}
              >
                <Heart
                  className={`h-5 w-5 transition-all duration-300 ${
                    hasLiked ? "fill-current scale-110" : "scale-100"
                  }`}
                />
                <span className="text-sm font-medium">{likesCount}</span>
              </button>

              <button
                onClick={handleComment}
                className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{commentsCount}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors"
                title="Share Event"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

EventCard.displayName = "EventCard";

export default EventCard;
