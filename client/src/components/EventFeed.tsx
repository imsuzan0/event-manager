
import { EventCard } from "./EventCard";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  image?: string;
  images?: string[];
  tags: string;
  phone: string;
  likes: number;
  comments: Array<{
    id: number;
    author: string;
    content: string;
    avatar: string;
  }>;
}

interface EventFeedProps {
  events: Event[];
  onLike: (eventId: number) => void;
  onComment: (eventId: number, comment: string) => void;
}

export const EventFeed = ({ events, onLike, onComment }: EventFeedProps) => {
  const currentDate = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= currentDate);
  const pastEvents = events.filter(event => new Date(event.date) < currentDate);

  return (
    <div className="space-y-12">
      <section className="animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="animate-scale-in">
              <EventCard 
                event={event} 
                onLike={onLike}
                onComment={onComment}
              />
            </div>
          ))}
        </div>
      </section>

      {pastEvents.length > 0 && (
        <section className="animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-600 mb-8 text-center">
            Past Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <div key={event.id} className="animate-scale-in">
                <EventCard 
                  event={event} 
                  onLike={onLike}
                  onComment={onComment}
                  isPast={true}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
