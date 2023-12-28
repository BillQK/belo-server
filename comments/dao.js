import { ObjectId } from "mongodb";
import model from "./model.js";

export const createComment = (comment) => model.create(comment);
export const findAllCommentByPostId = (postId) =>
  model.find({ postParentId: postId });
export const updateComment = (commentId, comment) =>
  model.updateOne({ _id: new ObjectId(commentId) }, { $set: comment });
export const deleteComment = (commentId) => model.deleteOne({ _id: commentId });
