import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import { Event } from '@/types/Event';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EventForm from '@/components/EventForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from "@/hooks/use-auth";
import { Plus } from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading events
    setTimeout(() => {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Tech Conference 2024',
          description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders, networking opportunities, and cutting-edge technology showcases.',
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
          description: 'Free health screenings, wellness workshops, and expert consultations. Bring your family for a day of health and wellness education.',
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
          description: 'Discover amazing works from local artists in our community. Live music, refreshments, and art for sale.',
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

  const filteredEvents = events.filter(event => {
    const now = new Date();
    if (filter === 'upcoming') return event.date >= now;
    if (filter === 'past') return event.date < now;
    return true;
  });

  const handleCreateEvent = async (formData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      date: new Date(formData.startDate), // Use start date as main date for compatibility
      image: formData.images?.[0] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      tags: formData.tags as 'Tech' | 'Health' | 'Others',
      phoneNumber: formData.phoneNumber,
      likes: 0,
      comments: []
    };

    setEvents(prev => [newEvent, ...prev]);
    setIsSubmitting(false);
    setIsDialogOpen(false);
    
    toast({
      title: "Success!",
      description: "Your event has been created successfully.",
    });
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const handleCreateEventClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsDialogOpen(true);
  };

  const handleLike = (eventId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, likes: event.likes + 1 }
        : event
    ));
  };

  const handleComment = (eventId: string, comment: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const newComment = {
      id: Date.now().toString(),
      author: user.name || 'You',
      text: comment,
      avatar: user.name ? user.name.charAt(0).toUpperCase() : 'Y'
    };
    
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, comments: [...event.comments, newComment] }
        : event
    ));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading amazing events...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded mb-4 w-3/4"></div>
              <div className="bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Discover Amazing{' '}
          <span className="bg-gradient-to-r from-teal-600 to-coral-600 bg-clip-text text-transparent">
            Events
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Connect with your community through exciting events, workshops, and gatherings
        </p>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={handleCreateEventClick}
              className="bg-gradient-to-r from-teal-500 to-coral-500 hover:from-teal-600 hover:to-coral-600 text-white px-6 py-3 rounded-full font-semibold mb-8"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          {user && (
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">
                  Create Your{' '}
                  <span className="bg-gradient-to-r from-teal-600 to-coral-600 bg-clip-text text-transparent">
                    Event
                  </span>
                </DialogTitle>
              </DialogHeader>
              <EventForm 
                onSubmit={handleCreateEvent}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          )}
        </Dialog>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
          {['all', 'upcoming', 'past'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as typeof filter)}
              className={`px-6 py-2 rounded-full transition-all duration-300 capitalize ${
                filter === filterType
                  ? 'bg-gradient-to-r from-teal-500 to-coral-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
