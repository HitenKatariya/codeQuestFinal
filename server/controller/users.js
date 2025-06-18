import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/auth.js";

// SIGNUP
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existinguser = await User.findOne({ email });
    if (existinguser) return res.status(404).json("User already exists");

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: newUser, token });
  } catch (err) {
    res.status(500).json("Something went wrong...");
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await User.findOne({ email });
    if (!existinguser) return res.status(404).json("User not found");

    const isPasswordCorrect = await bcrypt.compare(password, existinguser.password);
    if (!isPasswordCorrect) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existinguser, token });
  } catch (err) {
    res.status(500).json("Something went wrong...");
  }
};

// GET ALL USERS
export const getallusers = async (req, res) => {
  try {
    const users = await User.find();
    const alluserdetails = users.map((user) => ({
      _id: user._id,
      name: user.name,
      about: user.about,
      tags: user.tags,
      joinedon: user.createdAt,
      avatar: user.avatar,
      notificationEnabled: user.notificationEnabled,
      friends: user.friends ? user.friends.map(fid => fid.toString()) : [], // Ensure friends are string IDs
    }));
    res.status(200).json(alluserdetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// UPDATE PROFILE
export const updateprofile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("User not found");
  }

  try {
    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.about) updateFields.about = req.body.about;
    if (req.body.tags) {
      updateFields.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(',').map(tag => tag.trim());
    }
    if (req.file) {
      updateFields.avatar = `/uploads/${req.file.filename}`;
    } else if (req.body.avatar) {
      updateFields.avatar = req.body.avatar;
    }
    if (req.body.notificationEnabled !== undefined) {
      updateFields.notificationEnabled =
        req.body.notificationEnabled === "true" || req.body.notificationEnabled === true;
    }

    const updatedProfile = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    // Return as { result: updatedProfile } for frontend compatibility
    res.status(200).json({ result: updatedProfile });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add friend
export const addFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  if (userId === friendId) {
    return res.status(400).json({ message: "Cannot add yourself as a friend" });
  }
  
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    
    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends" });
    }
    
    // Add each user to the other's friends array
    user.friends.push(friendId);
    friend.friends.push(userId);
    
    // Save both users
    await user.save();
    await friend.save();
    
    // Get the updated user data
    const updatedUser = await User.findById(userId);
    
    res.json({
      message: "Friend added successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        about: updatedUser.about,
        tags: updatedUser.tags,
        avatar: updatedUser.avatar,
        notificationEnabled: updatedUser.notificationEnabled,
        friends: updatedUser.friends.map(f => f.toString()),
        createdAt: updatedUser.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single user by ID
export const getuserbyid = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      about: user.about,
      tags: user.tags,
      joinedon: user.createdAt,
      avatar: user.avatar,
      notificationEnabled: user.notificationEnabled,
      friends: user.friends ? user.friends.map(fid => fid.toString()) : [],
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};