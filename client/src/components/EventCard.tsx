
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, MapPin, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  image?: string;
  images?: string[];
  tags: string;
  phone: string;
  likes: number;
  comments: Array<{
    id: number;
    author: string;
    content: string;
    avatar: string;
  }>;
}

interface EventCardProps {
  event: Event;
  onLike: (eventId: number) => void;
  onComment: (eventId: number, comment: string) => void;
  isPast?: boolean;
}

export const EventCard = ({ event, onLike, onComment, isPast = false }: EventCardProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike(event.id);
  };

  const handleCardClick = () => {
    navigate(`/event/${event.id}`);
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Tech":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Health":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  const formattedDate = format(new Date(event.date), "MMM dd, yyyy");
  
  // Handle both old image property and new images array
  const displayImage = event.images && event.images.length > 0 
    ? event.images[0] 
    : event.image;
  
  const imageCount = event.images ? event.images.length : (event.image ? 1 : 0);

  return (
    <Card 
      className={`overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105 bg-white border-0 shadow-lg cursor-pointer transform ${isPast ? 'opacity-75' : ''}`}
      onClick={handleCardClick}
    >
      {displayImage && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={displayImage} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {isPast && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-gray-600 text-white">
                Past Event
              </Badge>
            </div>
          )}
          {imageCount > 1 && (
            <div className="absolute bottom-4 right-4">
              <Badge variant="secondary" className="bg-black/70 text-white">
                +{imageCount - 1} more
              </Badge>
            </div>
          )}
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge className={`${getTagColor(event.tags)} border`}>
            {event.tags}
          </Badge>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            {event.location}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Phone className="h-4 w-4 mr-2 text-green-500" />
            {event.phone}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{event.likes}</span>
            </Button>
            
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="h-4 w-4" />
              <span>{event.comments.length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
