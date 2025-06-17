import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Phone, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  event: Event;
  onRefresh?: () => void;
}

const EventCard = ({ event, onRefresh }: EventCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like events",
        variant: "default",
      });
      return;
    }
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to comment on events",
        variant: "default",
      });
      return;
    }
    setShowComments(!showComments);
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
              onClick={handleLike}
              className={`flex items-center text-gray-500 hover:text-teal-500 transition-colors ${
                isLiked ? "text-teal-500" : ""
              }`}
            >
              <Heart
                className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`}
              />
              <span className="text-sm">
                {(event.likes || 0) + (isLiked ? 1 : 0)}
              </span>
            </button>

            <button
              onClick={handleComment}
              className="flex items-center text-gray-500 hover:text-teal-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{event.comments?.length || 0}</span>
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

        {/* Comments section */}
        {showComments && event.comments && event.comments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Comments
            </h4>
            <div className="space-y-2">
              {event.comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-sm font-medium">
                    {comment.avatar || comment.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {comment.author}
                    </p>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
