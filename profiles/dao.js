import model from "./model.js";
import mongoose from "mongoose";
import * as postDao from "../posts/dao.js";
import * as userDao from "../users/dao.js";
export const createProfile = (profile) => model.create(profile);
export const findProfileByProfileId = (profileId) => model.findById(profileId);
export const findProfileByUserId = (userId) =>
  model.findOne({ userId: userId });
export const updateProfileByUserId = (userId, profile) =>
  model.updateOne({ userId: userId }, { $set: profile });
export const deletePost = (profileId) => model.deleteOne({ _id: profileId });
export const findAllProfiles = () => model.find().limit(15);
// Increment the following count for a user when they follow someone
export const updateFollowedCount = async (followedId) => {
  try {
    const response = await model.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(followedId) },
      { $inc: { followingCount: 1 } },
      { new: true }
    );
    console.log("Updating user:", followedId);
    console.log("Status: ", response);
  } catch (error) {
    console.error("Error updating followed count:", error);
    throw error;
  }
};

// Increment the follower count for a user when someone follows them
export const updateFollowerCount = async (followerId) => {
  try {
    const response = await model.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(followerId) },
      { $inc: { followerCount: 1 } },
      { new: true }
    );
    console.log("Updating user:", followerId);
    console.log("Status: ", response);
  } catch (error) {
    console.error("Error updating follower count:", error);
    throw error;
  }
};

export const deleteFollowedCount = async (followedId) => {
  try {
    const response = await model.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(followedId) },
      { $inc: { followingCount: -1 } },
      { new: true }
    );
    console.log("Updating user:", followedId);
    console.log("Status: ", response);
  } catch (error) {
    console.error("Error updating followed count:", error);
    throw error;
  }
};

// Increment the follower count for a user when someone follows them
export const deleteFollowerCount = async (followerId) => {
  try {
    const response = await model.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(followerId) },
      { $inc: { followerCount: -1 } },
      { new: true }
    );
    console.log("Updating user:", followerId);
    console.log("Status: ", response);
  } catch (error) {
    console.error("Error updating follower count:", error);
    throw error;
  }
};
export const increaseNumberOfPost = async (userId) => {
  try {
    const response = await model.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $inc: { numberOfPosts: 1 } },
      { new: true }
    );
    console.log("Updating profile's nop:", userId);
    console.log("Status: ", response);
  } catch (error) {
    console.error("Error updating followed count:", error);
    throw error;
  }
};

export const decreaseNumberOfPost = async (postId) => {
  try {
    // Retrieve the post to get the user ID before deleting it
    const post = await postDao.findPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const response = await model.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(post.userId) },
      { $inc: { numberOfPosts: -1 } },
      { new: true }
    );
    console.log("Updating profile's nop:", postId);
    console.log("Status: ", response);
  } catch (error) {
    console.error("Error updating followed count:", error);
    throw error;
  }
};

export const fuzzySearchUserName = async (searchTerm) => {
  try {
    console.log("SearchTerm", searchTerm);
    // Ensure searchTerm is a string and escape special regex characters
    const safeSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(safeSearchTerm, "i"); // 'i' for case-insensitivity
    console.log("Regex", regex);
    const userProfiles = await model
      .find({ userName: { $regex: regex } })
      .limit(10)
      .select("userId userName avatar");

    // Fetch 'restricted' status for each user and append it to the result
    const results = await Promise.all(
      userProfiles.map(async (profile) => {
        const user = await userDao
          .findUserById(profile.userId)
          .select("restricted");
        return {
          ...profile.toObject(),
          restricted: user ? user.restricted : false,
        };
      })
    );
    console.log("results", results);
    return results;
  } catch (error) {
    console.error("Error in fuzzySearchProfile:", error);
    throw error;
  }
};
