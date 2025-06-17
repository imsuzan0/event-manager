
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, Heart, MessageCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { Event } from '@/types/Event';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EventForm from '@/components/EventForm';
import { useToast } from '@/hooks/use-toast';

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  const handleCreateEvent = async (formData: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      date: new Date(formData.date),
      image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
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
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Manage and organize your events in one place
        </p>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-500 to-coral-500 hover:from-teal-600 hover:to-coral-600 text-white px-6 py-3 rounded-full font-semibold">
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
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
        </Dialog>
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-full transition-colors">
                <Plus className="h-5 w-5 mr-2" />
                Post Your First Event
              </Button>
            </DialogTrigger>
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
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
