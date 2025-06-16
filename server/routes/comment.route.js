import express from "express";
import {
  addComment,
  updateComment,
  deleteComment,
  getEventComments,
} from "../controllers/comment.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

const router = express.Router();

router.post("/events/:eventId/comment", protectRoute, addComment);
router.put("/comments/:commentId", protectRoute, updateComment);
router.delete("/comments/:commentId", protectRoute, deleteComment);
router.get("/events/:eventId/comments", protectRoute, getEventComments);

export const commentRouter = router;