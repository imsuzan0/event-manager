import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { EventFeed } from "@/components/EventFeed";
import { PostEventModal } from "@/components/PostEventModal";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "React Conference 2024",
      description:
        "Join us for the biggest React conference of the year! Learn about the latest features, best practices, and connect with fellow developers. This is a must-attend event for anyone working with React.",
      location: "San Francisco, CA",
      date: "2024-07-15",
      images: [
        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      ],
      tags: "Tech",
      phone: "+1 (555) 123-4567",
      likes: 42,
      comments: [
        {
          id: 1,
          author: "John Doe",
          content: "Can't wait for this event!",
          avatar: "JD",
        },
        {
          id: 2,
          author: "Jane Smith",
          content: "Will there be live streaming?",
          avatar: "JS",
        },
      ],
    },
    {
      id: 2,
      title: "Wellness Workshop",
      description:
        "A comprehensive wellness workshop focusing on mental health, nutrition, and physical fitness. Expert speakers will share insights on maintaining a healthy work-life balance in the tech industry.",
      location: "New York, NY",
      date: "2024-06-20",
      images: [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      ],
      tags: "Health",
      phone: "+1 (555) 987-6543",
      likes: 28,
      comments: [
        {
          id: 3,
          author: "Mike Wilson",
          content: "This sounds amazing!",
          avatar: "MW",
        },
      ],
    },
    {
      id: 3,
      title: "Past Event Example",
      description: "This is a past event that already happened.",
      location: "Los Angeles, CA",
      date: "2023-12-10",
      images: [],
      tags: "General",
      phone: "+1 (555) 111-2222",
      likes: 10,
      comments: [],
    },
  ]);

  const handlePostEvent = (newEvent: any) => {
    const eventWithId = {
      ...newEvent,
      id: events.length + 1,
      likes: 0,
      comments: [],
    };
    setEvents([eventWithId, ...events]);
    setIsPostModalOpen(false);
  };

  const handleLike = (eventId: number) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, likes: event.likes + 1 } : event
      )
    );
  };

  const handleComment = (eventId: number, comment: string) => {
    const newComment = {
      id: Date.now(),
      author: "You",
      content: comment,
      avatar: "YU",
    };

    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, comments: [...event.comments, newComment] }
          : event
      )
    );
  };

  // Filter upcoming events only
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header onPostEvent={() => setIsPostModalOpen(true)} />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Discover Amazing <span className="text-blue-600">Events</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with your community through exciting events in tech, health,
            and more
          </p>
        </div>

        {upcomingEvents.length > 0 ? (
          <EventFeed
            events={upcomingEvents}
            onLike={handleLike}
            onComment={handleComment}
          />
        ) : (
          <div className="text-center mt-10">
            <p className="text-red-600 text-2xl font-semibold mb-4">
              There are no upcoming events.
            </p>
            <Link
              to="/explore"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition"
            >
              Go to Explore Events
            </Link>
          </div>
        )}
      </main>
      <Footer />
      <PostEventModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostEvent}
      />
    </div>
  );
};

export default Index;
