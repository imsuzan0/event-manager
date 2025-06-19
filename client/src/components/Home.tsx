import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import type { Event } from "@/types/Event";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/ui/footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useEvent } from "@/contexts/event-context";
import { Plus, Loader2, CalendarDays, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm from "./EventForm";

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
    navigate("events/new")
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-indigo-50 to-[#fafafa] pb-32">
        {/* Decorative Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-4 pt-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center space-y-8">
                <div className="inline-block animate-bounce-slow">
                  <div className="flex items-center justify-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-800">
                      The Ultimate Event Platform
                    </span>
                  </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-800">
                    Where Amazing Events
                  </span>
                  <br />
                  <span className="text-gray-900">Come to Life</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Join, host, and experience unforgettable moments with people
                  who share your passions
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                  <Button
                    onClick={handleCreateEvent}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 h-auto text-lg rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    Create Event
                  </Button>
                </div>

                {/* Filter Section */}
                <div className="pt-12">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg w-fit mx-auto">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => setFilter("all")}
                        className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                          filter === "all"
                            ? "bg-indigo-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        All Events
                      </button>
                      <button
                        onClick={() => setFilter("upcoming")}
                        className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                          filter === "upcoming"
                            ? "bg-indigo-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        Upcoming
                      </button>
                      <button
                        onClick={() => setFilter("past")}
                        className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                          filter === "past"
                            ? "bg-indigo-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        Past
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid Section */}
      <div className="container mx-auto px-4 -mt-16 pb-24">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl max-w-2xl mx-auto border border-gray-100">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-50 flex items-center justify-center">
                <CalendarDays className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                No events found
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
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
                  className="mt-6 text-indigo-600 hover:text-indigo-700 text-lg font-medium"
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

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-sm border border-indigo-100 p-6 rounded-3xl mx-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-2xl font-bold">
              Create Event
            </DialogTitle>
          </DialogHeader>
          <EventForm
            mode="create"
            onSuccess={() => {
              setIsCreateDialogOpen(false);
              fetchEvents();
            }}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Home;