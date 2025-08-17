
import express from "express";
import { body } from "express-validator";
import protect from "../middleware/auth.js";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost
} from "../controllers/postController.js";

import { addComment, getCommentsForPost } from "../controllers/commentController.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/",
  protect,
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  createPost
);

router.get("/:id", getPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

// Comments related to a post
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", getCommentsForPost);

export default router;
