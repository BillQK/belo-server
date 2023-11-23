import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  profileId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  name: String,
  description: String,
  // Followers and following are not stored in the profile directly
  followerCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  numberOfPosts: { type: Number, default: 0 },
  // Change this later to gridFS 
  coverImage: String,
  avatar: String,
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
