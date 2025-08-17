
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: post._id
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate("author", "name email").sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // only owner or admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    await comment.remove();
    res.json({ message: "Comment removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
