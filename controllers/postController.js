
import Post from "../models/Post.js";
import { validationResult } from "express-validator";

export const createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  try {
    const { title, content, tags } = req.body;
    const post = await Post.create({
      title,
      content,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      author: req.user._id
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.max(1, parseInt(req.query.limit || "10"));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.author) filter.author = req.query.author;
    if (req.query.tags) {
      const tags = req.query.tags.split(",").map(t => t.trim());
      filter.tags = { $in: tags };
    }
    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) filter.createdAt.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) filter.createdAt.$lte = new Date(req.query.dateTo);
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate("author", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: posts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email role");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // only owner or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title, content, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags.split(",").map(t => t.trim());

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    await post.remove();
    res.json({ message: "Post removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
