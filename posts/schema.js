import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    spotifyContent: {
      contentName: String,
      contentType: {
        type: String,
        enum: ["audiobook", "artist", "song", "playlist", "album", "podcast"],
      },
      contentID: { type: String },
    },

    description: {
      type: String,
    },
    likesCount: {
      type: Number,
      default: 0,
    },

    createAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: "posts" }
);

export default postSchema;
