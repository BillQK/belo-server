import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    trackId: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default postSchema;
