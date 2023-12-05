import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    spotifyContent: {
      contentType: {
        type: String,
        enum: ["audiobook", "artist", "song", "playlist", "album", "podcast"],
      },
      contentID: { type: String },
    },

    description: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  { collection: "posts" }
);

export default postSchema;
