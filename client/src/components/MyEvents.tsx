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

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
      setIsEditDialogOpen(true);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
            <p className="text-gray-600">Manage your created events</p>
          </div>

          <Button
            onClick={() => navigate("/events/new")}
            className="mt-4 md:mt-0 bg-teal-500 hover:bg-teal-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Event
          </Button>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't created any events yet. Create your first event to
                get started!
              </p>
              <Button
                onClick={() => navigate("/events/new")}
                className="bg-teal-500 hover:bg-teal-600"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Event
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="relative group">
                <EventCard event={event} onRefresh={fetchMyEvents} />

                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => handleEditEvent(event._id)}
                    size="icon"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="bg-white text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this event? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteEvent(event._id)}
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
      </div>
    </div>
  );
};

export default MyEvents;
