
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Phone, Heart, MessageCircle, Send } from 'lucide-react';
import { Event } from '@/types/Event';

interface EventCardProps {
  event: Event;
  onLike: (eventId: string) => void;
  onComment: (eventId: string, comment: string) => void;
}

const EventCard = ({ event, onLike, onComment }: EventCardProps) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      onLike(event.id);
      setLiked(true);
    }
  };

  const handleCardClick = () => {
    navigate(`/event/${event.id}`);
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Tech': return 'bg-blue-100 text-blue-800';
      case 'Health': return 'bg-green-100 text-green-800';
      case 'Others': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(event.tags)}`}>
            {event.tags}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Phone className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.phoneNumber}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all ${
                liked 
                  ? 'bg-red-100 text-red-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{event.likes}</span>
            </button>
            
            <div className="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-600">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{event.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
