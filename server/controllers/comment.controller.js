import Comment from "../models/comment.model";

export const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;
    const { commentText } = req.body;

    if (!commentText) {
      return res.status(400).json({ msg: "Comment text is required" });
    }

    const comment = await Comment.create({
      user_id: userId,
      event_id: eventId,
      commentText,
    });
    res.status(201).json({ msg: "Comment added successfully", comment });
  } catch (error) {
    console.log("Error in addComment controller: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Comment not found" });
    }

    if (comment.user_id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to delete this comment" });
    }
    await comment.remove();
    res.status(200).json({ msg: "Comment removed successfully" });
  } catch (error) {
    console.log("Error in deleteComment controller: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { commentText } = req.body;
    const userId = req.user._id;

    if (!commentText) {
      return res.status(400).json({ msg: "Comment text is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Comment not found" });
    }

    if (comment.user_id.toString() !== userId.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "You are not authorized to update this comment" });
    }

    comment.commentText = commentText;
    await comment.save();
    res.status(200).json({ msg: "Comment updated successfully", comment });
  } catch (error) {
    console.log("Error in updateComment controller: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

export const getEventComments = async (req, res) => {
  try {
    const { eventId } = req.params;

    const comments = await Comment.find({ event_id: eventId }).populate(
      "user_id",
      "fullName email"
    );
    res.status(200).json({ count: comments.length, comments });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};
