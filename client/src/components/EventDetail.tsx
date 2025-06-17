import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Phone, Heart, MessageCircle, Send, ArrowLeft } from 'lucide-react';
import type { Event } from '@/types/event';
import { useEvent } from '@/contexts/event-context';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getEvent } = useEvent();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const fetchedEvent = await getEvent(id);
      setEvent(fetchedEvent);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, getEvent, toast, navigate]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like events",
        variant: "default",
      });
      return;
    }
    // TODO: Implement like functionality with backend
    setLiked(!liked);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to comment",
        variant: "default",
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement comment functionality with backend
      const newComment = {
        id: Date.now().toString(),
        author: user.name || 'Anonymous',
        text: commentText.trim(),
        avatar: user.name?.[0] || 'A'
      };
      
      if (event) {
        setEvent({
          ...event,
          comments: [...(event.comments || []), newComment]
        });
      }
      
      setCommentText('');
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatEventDate = (dateStr: string) => {
    return format(new Date(dateStr), 'PPPP');  // "Monday, April 29th, 2023"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')} variant="outline" className="inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </button>

        {/* Event Image */}
        <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
          <img
            src={event.image_urls?.[0] || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Event Content */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                {event.tag}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-gray-500 hover:text-teal-500 transition-colors ${
                  liked ? 'text-teal-500' : ''
                }`}
              >
                <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
                <span>{(event.likes || 0) + (liked ? 1 : 0)}</span>
              </button>
              <button
                onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center space-x-1 text-gray-500 hover:text-teal-500 transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
                <span>{event.comments?.length || 0}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 text-gray-600 mb-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-teal-500" />
              <span>{formatEventDate(event.date)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-teal-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-teal-500" />
              <span>{event.phone_number}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-line">{event.desc}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div id="comments-section" className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Comments {event.comments?.length ? `(${event.comments.length})` : ''}
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex space-x-4">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1"
                disabled={isSubmitting || !user}
              />
              <Button 
                type="submit"
                disabled={isSubmitting || !user}
                className="self-end"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
            {!user && (
              <p className="mt-2 text-sm text-gray-500">
                Please{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-teal-600 hover:text-teal-500 font-medium"
                >
                  login
                </button>
                {' '}to comment
              </p>
            )}
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {event.comments && event.comments.length > 0 ? (
              event.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium">
                      {comment.avatar || comment.author[0]}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{comment.author}</div>
                    <div className="mt-1 text-gray-700">{comment.text}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
