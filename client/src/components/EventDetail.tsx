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

  const formatEventDateTime = (dateStr: string) => {
    return format(new Date(dateStr), "PPPP 'at' p");
  };

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
      await fetchLikes();
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
      }, 500);

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
    return format(new Date(dateStr), "PPPP");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h2>
          <p className="text-gray-600 mb-4">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="inline-flex items-center border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </button>

        {/* Event Image Carousel */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl aspect-video border border-indigo-100 bg-white/80 backdrop-blur-sm">
          <img
            src={event.image_urls?.[currentImageIndex] || "/placeholder.svg"}
            alt={`${event.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain bg-indigo-50"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Navigation arrows */}
          {event.image_urls && event.image_urls.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600/80 text-white hover:bg-indigo-700 transition-all duration-300 shadow-md"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600/80 text-white hover:bg-indigo-700 transition-all duration-300 shadow-md"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-indigo-600/80 text-white text-sm font-medium">
                {currentImageIndex + 1} / {event.image_urls.length}
              </div>
            </>
          )}
        </div>

        {/* Event Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-10 border border-indigo-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                {event.title}
              </h1>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                {event.tag}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors ${
                  liked ? "text-indigo-600" : ""
                }`}
                aria-label="Like event"
              >
                <Heart className={`h-6 w-6 ${liked ? "fill-current" : ""}`} />
                <span className="font-semibold">{likesCount}</span>
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("comments-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors"
                aria-label="View comments"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="font-semibold">{comments.length}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 text-gray-700 mb-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
              <span className="font-medium">
                {formatEventDateTime(event.date)}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
              <span className="font-medium">{event.location}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-indigo-600" />
              <span className="font-medium">{event.phone_number}</span>
            </div>
          </div>

          <div className="prose max-w-none text-gray-800">
            <p className="whitespace-pre-line leading-relaxed text-lg">
              {event.desc}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div
          id="comments-section"
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-indigo-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-indigo-600" />
            Comments {comments.length ? `(${comments.length})` : ""}
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 h-12 bg-white/80 backdrop-blur-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl px-4 py-3 text-gray-800 resize-none transition-all duration-300"
                disabled={isSubmitting || !user}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !user}
                className="h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
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
                  className="text-indigo-600 hover:text-indigo-700 font-medium underline"
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
                <div key={comment._id} className="flex space-x-3 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shadow">
                      {comment.user_id.fullName[0]}
                    </div>
                  </div>
                  <div className="flex-grow bg-indigo-50 rounded-xl px-4 py-3 shadow-sm border border-indigo-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900">
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
                            className="text-gray-500 hover:text-indigo-600"
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
                            <AlertDialogContent className="bg-white/95 backdrop-blur-sm border border-indigo-100">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-900">
                                  Delete Comment
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                  Are you sure you want to delete this comment?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
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
                          className="mb-2 bg-white/80 backdrop-blur-sm border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl px-4 py-3 text-gray-800"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingComment(null);
                              setEditText("");
                            }}
                            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateComment(comment._id)}
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
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
                      <div className="mt-1 text-gray-800 text-base leading-relaxed">
                        {comment.text}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-4">
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