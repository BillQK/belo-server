import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    userName: { type: String, required: true, unique: true },
    displayName: String,
    description: String,
    // Followers and following are not stored in the profile directly
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    numberOfPosts: { type: Number, default: 0 },
    // Change this later to gridFS
    coverImage: { type: String, default: "/img/default-cover.png" },
    avatar: { type: String, default: "/img/default-avatar.png" },
  },
  { collection: "profiles" }
);

export default profileSchema;
