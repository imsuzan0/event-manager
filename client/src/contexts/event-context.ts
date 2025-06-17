import { createContext, useContext } from "react";
import type { Event, EventFormData } from "@/types/event";

interface EventContextType {
  createEvent: (data: EventFormData) => Promise<Event>;
  updateEvent: (id: string, data: Partial<EventFormData>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  getAllEvents: () => Promise<Event[]>;
  getEvent: (id: string) => Promise<Event>;
  getMyEvents: () => Promise<Event[]>;
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
