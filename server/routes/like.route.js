import express from "express";
import {
  likeUnlikeToggle,
  getEventLikes,
} from "../controllers/like.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

const router = express.Router();

router.post("/events/:eventId/like", protectRoute, likeUnlikeToggle);
router.get("/events/:eventId/likes", protectRoute, getEventLikes);

export const likeRouter = router;
