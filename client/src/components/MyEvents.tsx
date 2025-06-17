import { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, Heart, MessageCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { Event } from '@/types/Event';

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading events
    setTimeout(() => {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Tech Conference 2024',
          description: 'Join us for the biggest tech conference of the year!',
          location: 'San Francisco Convention Center',
          date: new Date('2024-07-15'),
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
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
          description: 'Free health screenings, wellness workshops, and expert consultations.',
          location: 'Central Park',
          date: new Date('2024-06-20'),
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
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
          description: 'Discover amazing works from local artists in our community.',
          location: 'Downtown Gallery',
          date: new Date('2024-05-10'),
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          tags: 'Others',
          phoneNumber: '+1 (555) 456-7890',
          likes: 15,
          comments: []
        }
      ];
      setEvents(mockEvents);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Your{' '}
          <span className="bg-gradient-to-r from-teal-600 to-coral-600 bg-clip-text text-transparent">
            Events
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Manage and organize your events in one place
        </p>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
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
                  <span className="text-sm">
                    {new Intl.DateTimeFormat('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }).format(event.date)}
                  </span>
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
                  <button className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-100 text-gray-600 transition-all">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{event.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-100 text-gray-600 transition-all">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{event.comments.length}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't posted any events yet.</p>
          <button className="mt-4 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-full transition-colors">
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Post Your First Event</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
