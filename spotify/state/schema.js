import mongoose from "mongoose";

const stateUserSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // or mongoose.Schema.Types.ObjectId if using ObjectId for user IDs
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 1 * 60 * 60 * 1000), // default to 1 hour from now
    },
  },
  { collection: "stateUsers" }
);

export default stateUserSchema;
