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
  updateImages,
  deleteImages,
  uploadImages,
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

router.get("/", getallEvents);
router.get("/myevents", protectRoute, getMyEvents);
router.get("/:id", protectRoute, getSingleEvent);
router.post(
  "/create",
  protectRoute,
  upload.array("images"),
  uploadImages,
  createEvent
);
router.patch(
  "/update/:id",
  protectRoute,
  upload.array("images"),
  updateImages,
  updateEvent
);
router.delete("/delete/:id", protectRoute,  deleteEvent);

// like
router.post("/like/:eventId", protectRoute, likeUnlikeToggle);
router.get("/likes/:eventId", getEventLikes);

//comment
router.post("/comment/create/:eventId", protectRoute, addComment);
router.patch("/comment/update/:commentId", protectRoute, updateComment);
router.delete("/comment/delete/:commentId", protectRoute, deleteComment);
router.get("/comments/:eventId", getEventComments);

export const eventRouter = router;
