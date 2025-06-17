import { useState } from "react";
import { Header } from "@/components/Header";
import { EventFeed } from "@/components/EventFeed";
import { Footer } from "@/components/Footer";

const currentUserId = 1;

const MyEvents = () => {
  const allEvents = [
    // 🔵 Upcoming Events
    {
      id: 1,
      creatorId: 1,
      title: "React Global Summit",
      description: "A large gathering of React enthusiasts and experts.",
      location: "London, UK",
      date: "2025-07-01",
      images: [
        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      ],
      tags: "Tech",
      phone: "+1 (555) 123-4567",
      likes: 42,
      comments: []
    },
    {
      id: 2,
      creatorId: 1,
      title: "AI Conference 2025",
      description: "Discover the latest in AI and machine learning.",
      location: "Berlin, Germany",
      date: "2025-07-15",
      images: [
        "https://images.unsplash.com/photo-1581091012184-7f06c7f03d4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      ],
      tags: "Tech",
      phone: "+1 (555) 987-6543",
      likes: 35,
      comments: []
    },
    {
      id: 3,
      creatorId: 1,
      title: "Startup Pitch 2025",
      description: "Pitch your startup ideas in front of top VCs.",
      location: "New York, NY",
      date: "2025-08-05",
      images: [
        "https://images.unsplash.com/photo-1573164574391-50774d96d8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      ],
      tags: "Business",
      phone: "+1 (555) 555-1234",
      likes: 50,
      comments: []
    },
    {
      id: 4,
      creatorId: 1,
      title: "Health & Wellness Expo",
      description: "Focus on mental and physical health with global experts.",
      location: "Tokyo, Japan",
      date: "2025-09-10",
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      ],
      tags: "Health",
      phone: "+1 (555) 222-3333",
      likes: 28,
      comments: []
    },
    {
      id: 5,
      creatorId: 1,
      title: "Global Tech Meetup",
      description: "Tech professionals from around the world meet to collaborate.",
      location: "Paris, France",
      date: "2025-10-01",
      images: [
        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      ],
      tags: "Networking",
      phone: "+1 (555) 444-5555",
      likes: 18,
      comments: []
    },

    // 🔴 Past Events
    {
      id: 6,
      creatorId: 1,
      title: "Tech Leaders Meetup",
      description: "A closed meetup for top tech leaders.",
      location: "San Francisco, CA",
      date: "2025-05-10",
      images: [
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      ],
      tags: "Leadership",
      phone: "+1 (555) 666-7777",
      likes: 30,
      comments: []
    },
    {
      id: 7,
      creatorId: 1,
      title: "Startup Grind 2025",
      description: "Startup founders share their growth journeys.",
      location: "Chicago, IL",
      date: "2025-05-25",
      images: [
        "https://images.unsplash.com/photo-1581090700227-6c1fc5f7d282?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      ],
      tags: "Startup",
      phone: "+1 (555) 888-9999",
      likes: 22,
      comments: []
    },
    {
      id: 8,
      creatorId: 1,
      title: "Designers Summit 2025",
      description: "Top designers discuss modern UI/UX practices.",
      location: "Toronto, Canada",
      date: "2025-06-01",
      images: [
        "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      ],
      tags: "Design",
      phone: "+1 (555) 123-0000",
      likes: 40,
      comments: []
    },
    {
      id: 9,
      creatorId: 1,
      title: "Hackathon 2025",
      description: "48 hours of intense coding and collaboration.",
      location: "Boston, MA",
      date: "2025-06-10",
      images: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      ],
      tags: "Hackathon",
      phone: "+1 (555) 321-4321",
      likes: 60,
      comments: []
    },
    {
      id: 10,
      creatorId: 1,
      title: "Networking Night 2025",
      description: "An exclusive networking event for tech professionals.",
      location: "Austin, TX",
      date: "2025-06-15",
      images: [
        "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      ],
      tags: "Networking",
      phone: "+1 (555) 654-9870",
      likes: 15,
      comments: []
    }
  ];

  const myEvents = allEvents.filter(event => event.creatorId === currentUserId);

  const [events, setEvents] = useState(myEvents);

  const handleLike = (eventId: number) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, likes: event.likes + 1 }
        : event
    ));
  };

  const handleComment = (eventId: number, comment: string) => {
    const newComment = {
      id: Date.now(),
      author: "You",
      content: comment,
      avatar: "YU"
    };

    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, comments: [...event.comments, newComment] }
        : event
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            My <span className="text-blue-600">Events</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Here are the events you have created.
          </p>
        </div>

        {events.length === 0 ? (
          <p className="text-center text-gray-500">You haven't created any events yet.</p>
        ) : (
          <EventFeed
            events={events}
            onLike={handleLike}
            onComment={handleComment}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyEvents;
