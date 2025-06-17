import { createContext, useContext } from "react";
import type { Event, EventFormData } from "@/types/Event";

interface Like {
  _id: string;
  user_id: {
    _id: string;
    fullName: string;
    profilePic?: string;
  };
  event_id: string;
}

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

interface EventContextType {
  createEvent: (data: EventFormData) => Promise<Event>;
  updateEvent: (id: string, data: Partial<EventFormData>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  getAllEvents: () => Promise<Event[]>;
  getEvent: (id: string) => Promise<Event>;
  getMyEvents: () => Promise<Event[]>;
  toggleLike: (eventId: string) => Promise<{ msg: string }>;
  getEventLikes: (eventId: string) => Promise<Like[]>;
  addComment: (eventId: string, commentText: string) => Promise<Comment>;
  updateComment: (
    commentId: string,
    commentText: string
  ) => Promise<{ msg: string; update: string }>;
  deleteComment: (commentId: string) => Promise<{ msg: string }>;
  getEventComments: (eventId: string) => Promise<Comment[]>;
}

export const EventContext = createContext<EventContextType | undefined>(
  undefined
);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
