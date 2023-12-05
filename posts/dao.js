import model from "./model.js";

export const createPost = (post) => model.create(post);
export const findAllPosts = () => model.find();
export const findPostById = (postId) => model.findById(postId);
export const findPostBypostId = (postId) => model.findOne({ _id: postId });
export const updatePost = (postId, post) =>
  model.updateOne({ _id: postId }, { $set: post });
export const deletePost = (postId) => model.deleteOne({ _id: postId });
export const findAllPostsByUserId = (userId) => model.find({ userId: userId });
