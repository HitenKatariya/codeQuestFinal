import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  about: String,
  tags: [String],
  avatar: String,
  notificationEnabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Add friends array
});

export default mongoose.model("User", UserSchema);