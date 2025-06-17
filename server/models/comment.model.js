import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    text:{
        type:String,
        required:true
    }
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
