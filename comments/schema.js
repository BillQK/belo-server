import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    postParentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      default: null,
    },
    commentParentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
      default: null,
    },
  },
  { collection: "comments" }
);

export default commentSchema;
