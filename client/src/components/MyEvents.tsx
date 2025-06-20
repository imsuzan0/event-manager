import { useState, useCallback, useEffect } from "react";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import EventCard from "@/components/EventCard";
import EventForm from "@/components/EventForm";
import { useEvent } from "@/contexts/event-context";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import type { Event } from "@/types/Event";
import { Footer } from "@/components/ui/footer";

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  const { getMyEvents, deleteEvent } = useEvent();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getMyEvents();
      console.log("Fetched Events:", fetchedEvents);
      setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your events. Please try again.",
        variant: "destructive",
      });
      setEvents([]); // clear on error
    } finally {
      setLoading(false);
    }
  }, [getMyEvents, toast]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handleEditEvent = (eventId: string) => {
    const selectedEvent = events.find((event) => event._id === eventId);
    if (selectedEvent) {
      setEditingEvent(selectedEvent);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      await fetchMyEvents();
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to create an event",
        variant: "default",
      });
      navigate("/login", { state: { from: location } });
      return;
    }
    navigate("/events/new");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-indigo-50 to-[#fafafa] min-h-screen  pb-72">
      {/* Decorative blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Events</h1>
          <Button
            onClick={handleCreateEvent}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 h-auto text-sm rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {!Array.isArray(events) || events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              You haven't created any events yet.
            </p>
            <Button
              onClick={handleCreateEvent}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 h-auto text-sm rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRefresh={fetchMyEvents}
                onEdit={() => handleEditEvent(event._id)}
                onDelete={() => {
                  setDeletingEventId(event._id);
                  handleDeleteEvent(event._id);
                }}
                showActions={true}
              />
            ))}
          </div>
        )}

        {/* Edit Event Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto">
              {editingEvent && (
                <EventForm
                  mode="edit"
                  eventId={editingEvent._id}
                  initialData={{
                    title: editingEvent.title,
                    desc: editingEvent.desc,
                    date: editingEvent.date,
                    location: editingEvent.location,
                    tag: editingEvent.tag,
                    phoneNumber: editingEvent.phone_number,
                  }}
                  existingImages={editingEvent.image_urls}
                  onSuccess={() => {
                    setIsDialogOpen(false);
                    fetchMyEvents();
                  }}
                  onCancel={() => setIsDialogOpen(false)}
                />
              )}
            </div>

            {/* Dialog Footer (Sticky Buttons) */}
            <div className="mt-4 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" form="event-form">
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default MyEvents;
