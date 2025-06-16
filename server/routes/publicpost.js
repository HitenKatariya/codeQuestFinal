import express from "express";
import mongoose from "mongoose";
import PublicPost from "../models/PublicPost.js";
import User from "../models/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Helper: get post limit based on friend count
function getPostLimit(friendCount) {
  if (friendCount === 0) return 0;
  if (friendCount === 1) return 1;
  if (friendCount === 2) return 2;
  if (friendCount > 10) return 1000; // Arbitrary high number for unlimited
  return 1;
}

// Create a public post
router.post("/", upload.single("media"), async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const friendCount = user.friends.length;
    const postLimit = getPostLimit(friendCount);
    const today = new Date();
    today.setHours(0,0,0,0);
    const postsToday = await PublicPost.countDocuments({
      user: userId,
      createdAt: { $gte: today }
    });
    if (postsToday >= postLimit) {
      return res.status(403).json({ message: "Post limit reached for today" });
    }
    if (postLimit === 0) {
      return res.status(403).json({ message: "You need friends to post" });
    }
    const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
    const newPost = new PublicPost({
      user: userId,
      mediaUrl: `/uploads/${req.file.filename}`,
      mediaType,
      caption: req.body.caption || ""
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all public posts (feed)
router.get("/", async (req, res) => {
  try {
    const posts = await PublicPost.find()
      .populate("user", "name avatar")
      .populate("comments.user", "name avatar")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like a post
router.post("/:id/like", async (req, res) => {
  try {
    const post = await PublicPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
      await post.save();
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Comment on a post
router.post("/:id/comment", async (req, res) => {
  try {
    const post = await PublicPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.comments.push({ user: req.body.userId, text: req.body.text });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Share a post
router.post("/:id/share", async (req, res) => {
  try {
    const post = await PublicPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.shares.includes(req.body.userId)) {
      post.shares.push(req.body.userId);
      await post.save();
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await PublicPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if the user is the owner of the post
    if (post.user.toString() !== req.query.userId) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }
    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
