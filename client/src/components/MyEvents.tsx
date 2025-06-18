import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Phone,
  Heart,
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import type { Event } from "@/types/Event";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEvent } from "@/contexts/event-context";
import EventCard from "./EventCard";
import EventForm from "./EventForm";

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  const { getMyEvents, deleteEvent } = useEvent();
  const navigate = useNavigate();

  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getMyEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your events. Please try again.",
        variant: "destructive",
      });
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Events</h1>
        <Button
          onClick={() => navigate("/post-event")}
          className="bg-teal-500 hover:bg-teal-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            You haven't created any events yet.
          </p>
          <Button
            onClick={() => navigate("/post-event")}
            className="bg-teal-500 hover:bg-teal-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Event
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="relative">
              <EventCard event={event} onRefresh={fetchMyEvents} />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleEditEvent(event._id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setDeletingEventId(event._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this event? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setDeletingEventId(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (deletingEventId) {
                            handleDeleteEvent(deletingEventId);
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <EventForm
              mode="edit"
              initialData={{
                title: editingEvent.title,
                desc: editingEvent.desc,
                date: editingEvent.date,
                location: editingEvent.location,
                tag: editingEvent.tag,
                phoneNumber: editingEvent.phone_number,
              }}
              eventId={editingEvent._id}
              onSuccess={() => {
                setIsDialogOpen(false);
                fetchMyEvents();
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyEvents;
