import React, { useState } from "react";
import { EventContext } from "./event-context";
import type { Event, EventFormData } from "@/types/Event";

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const serverUrl = "https://api.eventghar.xyz/api";
    const serverUrl = "http://localhost:3000/api"


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

  const updateEvent = async (
    id: string,
    data: Partial<EventFormData> & { existingImages?: string[] }
  ) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append("images", file);
        });
      } else if (key === "existingImages" && Array.isArray(value)) {
        // Send existing images as JSON string to preserve array structure
        formData.append("existingImages", JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    try {
      const response = await fetch(`${serverUrl}/event/update/${id}`, {
        method: "PATCH",
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
      const response = await fetch(`${serverUrl}/event/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

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
      const response = await fetch(`${serverUrl}/event`, {
        credentials: "include",
      });

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
      const response = await fetch(`${serverUrl}/event/${id}`, {
        credentials: "include",
      });

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
      const response = await fetch(`${serverUrl}/event/myevents`, {
        credentials: "include",
      });

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

  const toggleLike = async (eventId: string) => {
    try {
      const response = await fetch(`${serverUrl}/event/like/${eventId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to toggle like");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  };

  const getEventLikes = async (eventId: string) => {
    try {
      const response = await fetch(`${serverUrl}/event/likes/${eventId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch likes");
      }

      const { likes } = await response.json();
      return likes;
    } catch (error) {
      console.error("Error fetching likes:", error);
      throw error;
    }
  };

  const addComment = async (eventId: string, commentText: string) => {
    try {
      const response = await fetch(
        `${serverUrl}/event/comment/create/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commentText }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to add comment");
      }

      const { comment } = await response.json();
      return comment;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  const updateComment = async (commentId: string, commentText: string) => {
    try {
      const response = await fetch(
        `${serverUrl}/event/comment/update/${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commentText }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update comment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `${serverUrl}/event/comment/delete/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to delete comment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };

  const getEventComments = async (eventId: string) => {
    try {
      const response = await fetch(`${serverUrl}/event/comments/${eventId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch comments");
      }

      const { comments } = await response.json();
      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
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
        toggleLike,
        getEventLikes,
        addComment,
        updateComment,
        deleteComment,
        getEventComments,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
