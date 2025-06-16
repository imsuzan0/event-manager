import { Like } from "../models/like.model.js";
import { StatusCodes } from "http-status-codes";

export const likeUnlikeToggle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const existingLike = await Like.findOne({
      user_id: userId,
      event_id: eventId,
    });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id.toString());
      return res
        .status(StatusCodes.OK)
        .json({ msg: "Like removed successfully" });
    } else {
      const like = new Like({
        user_id: userId,
        event_id: eventId,
      });
      await like.save();
      return res
        .status(StatusCodes.OK)
        .json({ msg: "Like added successfully" });
    }
  } catch (error) {
    console.error("Error in likeUnlike controller: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

export const getEventLikes = async (req, res) => {
  try {
    const { eventId } = req.params;
    const likes = await Like.find({ event_id: eventId }).populate(
      "user_id",
      "fullName profilePic"
    );

    if (likes.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ msg: "No likes found for this event" });
    }
    res.status(StatusCodes.OK).json({ msg: "Likes found successfully", likes });
  } catch (error) {
    console.error("Error in getEventLikes controller: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};
