
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Phone, Heart, MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { Event } from '@/types/Event';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Simulate loading event data
    setTimeout(() => {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Tech Conference 2024',
          description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders, networking opportunities, and cutting-edge technology showcases. This is a comprehensive event that will cover the latest trends in artificial intelligence, machine learning, blockchain technology, and cloud computing. We will have hands-on workshops, panel discussions, and networking sessions to help you connect with like-minded professionals.',
          location: 'San Francisco Convention Center',
          date: new Date('2024-07-15'),
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
          tags: 'Tech',
          phoneNumber: '+1 (555) 123-4567',
          likes: 42,
          comments: [
            { id: '1', author: 'John Doe', text: 'Excited to attend!', avatar: 'JD' },
            { id: '2', author: 'Jane Smith', text: 'Great lineup of speakers!', avatar: 'JS' }
          ]
        },
        {
          id: '2',
          title: 'Community Health Fair',
          description: 'Free health screenings, wellness workshops, and expert consultations. Bring your family for a day of health and wellness education.',
          location: 'Central Park',
          date: new Date('2024-06-20'),
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
          tags: 'Health',
          phoneNumber: '+1 (555) 987-6543',
          likes: 28,
          comments: [
            { id: '3', author: 'Sarah Wilson', text: 'This sounds amazing!', avatar: 'SW' }
          ]
        },
        {
          id: '3',
          title: 'Local Art Exhibition',
          description: 'Discover amazing works from local artists in our community. Live music, refreshments, and art for sale.',
          location: 'Downtown Gallery',
          date: new Date('2024-05-10'),
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          tags: 'Others',
          phoneNumber: '+1 (555) 456-7890',
          likes: 15,
          comments: []
        }
      ];
      
      const foundEvent = mockEvents.find(e => e.id === id);
      setEvent(foundEvent || null);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleLike = () => {
    if (!liked && event) {
      setEvent({ ...event, likes: event.likes + 1 });
      setLiked(true);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && event) {
      const comment = {
        id: Date.now().toString(),
        author: 'You',
        text: newComment.trim(),
        avatar: 'Y'
      };
      
      setEvent({ ...event, comments: [...event.comments, comment] });
      setNewComment('');
    }
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-64 rounded-xl mb-6"></div>
          <div className="bg-gray-200 h-8 rounded mb-4 w-3/4"></div>
          <div className="bg-gray-200 h-4 rounded mb-2 w-full"></div>
          <div className="bg-gray-200 h-4 rounded mb-4 w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Events</span>
      </button>

      {/* Event Image */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute top-6 right-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTagColor(event.tags)}`}>
            {event.tags}
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {event.title}
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-3 text-teal-500" />
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">{formatDate(event.date)}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-3 text-teal-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{event.location}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="h-5 w-5 mr-3 text-teal-500" />
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">{event.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About This Event</h2>
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        </div>

        {/* Like and Comment Actions */}
        <div className="flex items-center space-x-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              liked 
                ? 'bg-red-100 text-red-600' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            <span>{event.likes} likes</span>
          </button>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <MessageCircle className="h-5 w-5" />
            <span>{event.comments.length} comments</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Comments</h2>
        
        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-coral-400 rounded-full flex items-center justify-center text-white font-medium">
              Y
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Post Comment</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {event.comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            event.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-coral-400 rounded-full flex items-center justify-center text-white font-medium">
                  {comment.avatar}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-medium text-gray-900 mb-1">{comment.author}</p>
                    <p className="text-gray-600">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
