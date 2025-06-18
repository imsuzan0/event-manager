import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Phone,
  Heart,
  MessageCircle,
  Send,
  ArrowLeft,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Event } from "@/types/Event";
import { useEvent } from "@/contexts/event-context";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
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

interface Comment {
  _id: string;
  user_id: {
    _id: string;
    fullName: string;
    email: string;
  };
  event_id: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {
    getEvent,
    toggleLike,
    getEventLikes,
    addComment,
    updateComment,
    deleteComment,
    getEventComments,
  } = useEvent();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLikes = useCallback(async () => {
    if (!id) return;
    try {
      const response = await getEventLikes(id);
      const eventLikes = Array.isArray(response) ? response : [];
      setLikesCount(eventLikes.length);
      if (user) {
        setLiked(eventLikes.some((like) => like.user_id._id === user.id));
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
      setLikesCount(0);
      setLiked(false);
    }
  }, [id, getEventLikes, user]);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const eventComments = await getEventComments(id);
      setComments(eventComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  }, [id, getEventComments]);

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const fetchedEvent = await getEvent(id);
      setEvent(fetchedEvent);
      await Promise.all([fetchLikes(), fetchComments()]);
    } catch (error) {
      toast({
        title: "Error",
        duration: 5000,
        description: "Failed to load event details",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [id, getEvent, toast, navigate, fetchLikes, fetchComments]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleView = () => {
    if (user) {
      navigate(`/events/${event._id}`);
    } else {
      navigate("/signup");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like events",
        variant: "default",
        duration: 3000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 500);
      return;
    }

    if (!id) return;

    try {
      await toggleLike(id);
      await fetchLikes(); // Refresh likes count and status
      toast({
        title: liked ? "Event unliked" : "Event liked",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to comment",
        variant: "default",
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 500); // Quick delay to show toast before redirect

      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!id) return;
      await addComment(id, commentText.trim());
      await fetchComments();
      setCommentText("");
      toast({
        title: "Success",
        description: "Comment added successfully",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateComment(commentId, editText.trim());
      await fetchComments();
      setEditingComment(null);
      setEditText("");
      toast({
        title: "Success",
        description: "Comment updated successfully",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsSubmitting(true);
    try {
      await deleteComment(commentId);
      await fetchComments();
      toast({
        title: "Success",
        description: "Comment deleted successfully",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatEventDate = (dateStr: string) => {
    return format(new Date(dateStr), "PPPP"); // "Monday, April 29th, 2023"
  };

  const nextImage = () => {
    if (!event?.image_urls) return;
    setCurrentImageIndex((prev) => (prev + 1) % event.image_urls.length);
  };

  const prevImage = () => {
    if (!event?.image_urls) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + event.image_urls.length) % event.image_urls.length
    );
  };

  const handleImageNext = () => {
    if (!event) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === event.image_urls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImagePrev = () => {
    if (!event) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? event.image_urls.length - 1 : prevIndex - 1
    );
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h2>
          <p className="text-gray-600 mb-4">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="inline-flex items-center"
          >
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

        {/* Event Image Carousel */}
        <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg aspect-video">
          <img
            src={event.image_urls?.[currentImageIndex] || "/placeholder.svg"}
            alt={`${event.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain bg-gray-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Navigation arrows */}
          {event.image_urls && event.image_urls.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm">
                {currentImageIndex + 1} / {event.image_urls.length}
              </div>
            </>
          )}
        </div>

        {/* Event Content */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event.title}
              </h1>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                {event.tag}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-gray-500 hover:text-teal-500 transition-colors ${
                  liked ? "text-teal-500" : ""
                }`}
              >
                <Heart className={`h-6 w-6 ${liked ? "fill-current" : ""}`} />
                <span>{likesCount}</span>
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("comments-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center space-x-1 text-gray-500 hover:text-teal-500 transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
                <span>{comments.length}</span>
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
        <div
          id="comments-section"
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Comments {comments.length ? `(${comments.length})` : ""}
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
                Please{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-teal-600 hover:text-teal-500 font-medium"
                >
                  login
                </button>{" "}
                to comment
              </p>
            )}
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium">
                      {comment.user_id.fullName[0]}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {comment.user_id.fullName}
                      </div>
                      {user && comment.user_id._id === user.id && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingComment(comment._id);
                              setEditText(comment.text);
                            }}
                            className="text-gray-500 hover:text-teal-500"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Comment
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this comment?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                    {editingComment === comment._id ? (
                      <div className="mt-2">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingComment(null);
                              setEditText("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateComment(comment._id)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 text-gray-700">{comment.text}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
