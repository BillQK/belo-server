import model from "./model.js";

export const createUserLikesPost = (userId, postId, title) =>
  model.create({ user: userId, postId, title });

export const deleteUserLikesPost = (userId, postId) =>
  model.deleteOne({ user: userId, postId });

export const findUsersLikedPost = (postId) =>
  model.find({ postId }).populate("user").exec();

export const findPostsLikedByUser = (userId) => model.find({ user: userId });
