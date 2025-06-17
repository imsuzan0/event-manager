import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import type { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useEvent } from "@/contexts/event-context";
import { Plus, Loader2 } from "lucide-react";

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const { toast } = useToast();
  const { user } = useAuth();
  const { getAllEvents } = useEvent();
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load events. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [getAllEvents, toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();

    switch (filter) {
      case "upcoming":
        return eventDate > now;
      case "past":
        return eventDate < now;
      default:
        return true;
    }
  });

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
          <p className="text-gray-600">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join exciting events, meet new people, and create unforgettable
            memories
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === "all"
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === "upcoming"
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === "past"
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600"
              }`}
            >
              Past
            </button>
          </div>

          <Button
            onClick={handleCreateEvent}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-2 rounded-full hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600">
                {filter === "all"
                  ? "There are no events available at the moment."
                  : filter === "upcoming"
                  ? "There are no upcoming events scheduled."
                  : "There are no past events to show."}
              </p>
              {!user && (
                <Button
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="mt-4 text-teal-600 hover:text-teal-700"
                >
                  Login to create an event
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRefresh={fetchEvents}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
