import mongoose from "mongoose";
const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
  },
  { collection: "likes" }
);
// Define a compound unique index for the combination of user and postId
schema.index({ user: 1, postId: 1 }, { unique: true });

export default schema;
