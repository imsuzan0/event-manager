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
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
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
  "/update",
  protectRoute,
  upload.single("image"),
  updateImage,
  updateEvent
);
router.delete("/delete", protectRoute, deleteImage, deleteEvent);

export const eventRouter = router;
