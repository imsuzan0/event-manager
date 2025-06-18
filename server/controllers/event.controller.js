import { StatusCodes } from "http-status-codes";
import { Event } from "../models/event.model.js";
import cloudinary from "../utils/cloudinary.connection.js";

export const createEvent = async (req, res) => {
  const { title, desc, date, location, tag, phoneNumber } = req.body;
  const userId = req.user.id;
  const images = req.uploadedImages || [];
  const imageUrls = images.map((img) => img.secure_url);

  if (!title || !desc || !date || !location || !tag || !phoneNumber) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please fill in all the required fields" });
  }
  try {
    const event = await Event.create({
      user_id: userId,
      title,
      desc,
      date,
      location,
      tag,
      phone_number: phoneNumber,
      image_urls: imageUrls,
    });
    return res.status(StatusCodes.CREATED).json({
      msg: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error in event creation", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, desc, date, location, tag } = req.body;

  const images = req.uploadedImages || [];
  const imageUrls = images.map((img) => img.secure_url);

  const event = await Event.findById(id);
  if (!event) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Event not found" });
  }

  if (event.user_id.toString() != userId.toString()) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "You are not authorized to update this event" });
  }

  try {
    const update = await Event.updateOne(
      { _id: id },
      {
        $set: {
          title,
          desc,
          date,
          location,
          tag,
          image_urls: imageUrls,
        },
      }
    );
    if (update.matchedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Event not found" });
    } else if (update.modifiedCount === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "No changes made to the event" });
    }

    const updatedEvent = await Event.findById(id);
    return res.status(StatusCodes.OK).json({
      msg: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating the event:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error updating the event" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    const userId = req.user.id;

    if (!event) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Event not found" });
    }

    if (event.user_id.toString() !== userId.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "You are not authorized to delete this event" });
    }

    const images = event.image_urls || [];

    if (images.length > 0) {
      await Promise.all(
        images.map((image) => cloudinary.uploader.destroy(image))
      );
    }

    await Event.findByIdAndDelete(id);
    res.status(200).json({ msg: "Event removed successfully" });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

export const getallEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    return res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

export const getSingleEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    return res.json(event);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const events = await Event.find({ user_id: userId });
    if (events.length === 0) {
      return res.status(200).json({ msg: "You have no posts yet" });
    }

    return res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};
