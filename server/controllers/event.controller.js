import { StatusCodes } from "http-status-codes";
import Event from "../models/event.model.js";

export const createEvent = async (req, res) => {
  const { title, desc, date, location, tag } = req.body;
  const userId = req.user._id;
  const imageUrl = req.image_secure_url;

  if (!title || !desc || !date || !location || !tag) {
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
      image_url: imageUrl,
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
  const imageUrl = req.image_secure_url;
  const userId = req.user._id;
  const { title, desc, date, location, tag } = req.body;

  const event = await Event.findById(id);
  if (!event) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Event not found" });
  }

  if (event.user_id != userId) {
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
          image_url: imageUrl,
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

    return res.status(StatusCodes.OK).json({
      msg: "Product updated successfully",
      event,
    });
  } catch (error) {
    console.error("Error updating the product:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error updating the event" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    const userId = req.user._id;
    if (!event) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Event not found" });
    }

    if (event.user_id != userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "You are not authorized to delete this event" });
    }

    await event.remove();
    res.status(200).json({ msg: "Event removed successfully" });
  } catch (error) {
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

    const events = await Event.find({ "_id": userId });
    if (events.length === 0) {
      return res.status(200).json({ msg: "You have no posts yet" });
    }

    return res.json(events);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};
