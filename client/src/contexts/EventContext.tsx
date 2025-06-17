import React, { useState } from "react";
import { EventContext } from "./event-context";
import type { Event, EventFormData } from "@/types/event";

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const serverUrl = "http://localhost:3000/api";

  const createEvent = async (data: EventFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append("images", file);
        });
      } else {
        formData.append(key, String(value));
      }
    });

    try {
      const response = await fetch(`${serverUrl}/event/create`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to create event");
      }

      const { event } = await response.json();
      return event;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  const updateEvent = async (id: string, data: Partial<EventFormData>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append("images", file);
        });
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    try {
      const response = await fetch(`${serverUrl}/event/update/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update event");
      }

      const { event } = await response.json();
      return event;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(
        `${serverUrl}/event/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };

  const getAllEvents = async () => {
    try {
      const response = await fetch(
        `${serverUrl}/event/`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch events");
      }

      const events = await response.json();
      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  };

  const getEvent = async (id: string) => {
    try {
      const response = await fetch(
        `${serverUrl}/event/${id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch event");
      }

      const event = await response.json();
      return event;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  };

  const getMyEvents = async () => {
    try {
      const response = await fetch(
        `${serverUrl}/event/myevents`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch your events");
      }

      const events = await response.json();
      return events;
    } catch (error) {
      console.error("Error fetching your events:", error);
      throw error;
    }
  };

  return (
    <EventContext.Provider
      value={{
        createEvent,
        updateEvent,
        deleteEvent,
        getAllEvents,
        getEvent,
        getMyEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
