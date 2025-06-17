
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Heart, MessageCircle, MapPin, Phone, Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
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

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  // Mock data - in a real app, this would come from an API or global state
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: "React Conference 2024",
        description: "Join us for the biggest React conference of the year! Learn about the latest features, best practices, and connect with fellow developers. This is a must-attend event for anyone working with React. We'll have keynote speakers from Facebook, Netflix, and other major tech companies sharing their insights on the future of React development. The conference will cover topics including React 18 features, server components, concurrent rendering, and performance optimization techniques.",
        location: "San Francisco, CA",
        date: "2024-07-15",
        images: [
          "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
          "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        ],
        tags: "Tech",
        phone: "+1 (555) 123-4567",
        likes: 42,
        comments: [
          { id: 1, author: "John Doe", content: "Can't wait for this event!", avatar: "JD" },
          { id: 2, author: "Jane Smith", content: "Will there be live streaming?", avatar: "JS" }
        ]
      },
      {
        id: 2,
        title: "Wellness Workshop",
        description: "A comprehensive wellness workshop focusing on mental health, nutrition, and physical fitness. Expert speakers will share insights on maintaining a healthy work-life balance in the tech industry. This workshop is designed for professionals who want to improve their overall well-being while maintaining peak performance at work. We'll cover stress management techniques, healthy eating habits for busy professionals, and simple exercise routines that can be done anywhere.",
        location: "New York, NY",
        date: "2024-06-20",
        images: [
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        ],
        tags: "Health",
        phone: "+1 (555) 987-6543",
        likes: 28,
        comments: [
          { id: 3, author: "Mike Wilson", content: "This sounds amazing!", avatar: "MW" }
        ]
      }
    ];

    const foundEvent = mockEvents.find(e => e.id === parseInt(id || "0"));
    setEvent(foundEvent || null);
  }, [id]);

  const handleLike = () => {
    if (event) {
      setIsLiked(!isLiked);
      setEvent({ ...event, likes: isLiked ? event.likes - 1 : event.likes + 1 });
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim() && event) {
      const comment = {
        id: Date.now(),
        author: "You",
        content: newComment,
        avatar: "YU"
      };
      setEvent({ ...event, comments: [...event.comments, comment] });
      setNewComment("");
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Tech":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Health":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 animate-fade-in">
        <Header onPostEvent={() => {}} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-600">Event not found</h2>
            <Button onClick={() => navigate("/")} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = format(new Date(event.date), "MMMM dd, yyyy");
  const isPast = new Date(event.date) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 animate-fade-in">
      <Header onPostEvent={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate("/")} 
          variant="outline" 
          className="mb-6 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <Card className="overflow-hidden shadow-xl bg-white border-0 animate-scale-in">
          {event.images && event.images.length > 0 && (
            <div className="relative h-64 md:h-96">
              {event.images.length === 1 ? (
                <div className="relative h-full overflow-hidden">
                  <img 
                    src={event.images[0]} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {isPast && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-gray-600 text-white">
                        Past Event
                      </Badge>
                    </div>
                  )}
                </div>
              ) : (
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    {event.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative h-64 md:h-96 overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${event.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {isPast && index === 0 && (
                            <div className="absolute top-4 right-4">
                              <Badge variant="secondary" className="bg-gray-600 text-white">
                                Past Event
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
              )}
            </div>
          )}
          
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <Badge className={`${getTagColor(event.tags)} border`}>
                {event.tags}
              </Badge>
              <div className="flex items-center text-gray-500">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="text-lg">{formattedDate}</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              {event.title}
            </h1>
            
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {event.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-6 w-6 mr-3 text-blue-500" />
                <span className="text-lg">{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-6 w-6 mr-3 text-green-500" />
                <span className="text-lg">{event.phone}</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 pb-8 border-b border-gray-200">
              <Button 
                variant="ghost" 
                size="lg"
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-lg font-semibold">{event.likes}</span>
              </Button>
              
              <div className="flex items-center space-x-2 text-gray-500">
                <MessageCircle className="h-6 w-6" />
                <span className="text-lg font-semibold">{event.comments.length}</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Comments</h3>
              
              <div className="space-y-6 mb-8">
                {event.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {comment.avatar}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="font-semibold text-gray-800 mb-1">{comment.author}</div>
                      <div className="text-gray-600">{comment.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-4">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 h-12"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                />
                <Button 
                  onClick={handleSubmitComment}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 px-8"
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;
