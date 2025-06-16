import express from "express";
import {
  createEvent,
  deleteEvent,
  getallEvents,
  getMyEvents,
  getSingleEvent,
  updateEvent,
} from "../controllers/event.controller.js";
import {
  updateImage,
  deleteImage,
  uploadImage,
  upload,
} from "../middlewares/cloudinary.middleware.js";
import {
  addComment,
  updateComment,
  deleteComment,
  getEventComments,
} from "../controllers/comment.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import { getEventLikes, likeUnlikeToggle } from "../controllers/like.controller.js";
const router = express.Router();

router.get("/", protectRoute, getallEvents);
router.get("/myevents", protectRoute, getMyEvents);
router.get("/:id", protectRoute, getSingleEvent);
router.post(
  "/create",
  protectRoute,
  upload.single("image"),
  uploadImage,
  createEvent
);
router.patch(
  "/update/:id",
  protectRoute,
  upload.single("image"),
  updateImage,
  updateEvent
);
router.delete("/delete/:id", protectRoute, deleteImage, deleteEvent);

// like
router.post("/like/:eventId", protectRoute, likeUnlikeToggle);
router.get("/likes/:eventId", getEventLikes);

//comment
router.post("/comment/create/:eventId", protectRoute, addComment);
router.patch("/comment/update/:commentId", protectRoute, updateComment);
router.delete("/comment/delete/:commentId", protectRoute, deleteComment);
router.get("/comments/:eventId", getEventComments);

export const eventRouter = router;
