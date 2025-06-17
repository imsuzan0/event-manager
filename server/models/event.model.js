import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      enum: ["Tech", "Health", "Others"],
      default: "Others",
    },
    image_urls: {
    type: [{ secure_url: String, public_id: String }],
    required: false,
    },
    phone_number: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);