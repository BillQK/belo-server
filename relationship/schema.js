import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  follows: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

relationshipSchema.index({ user: 1, follows: 1 }, { unique: true });

const Relationship = mongoose.model("Relationship", relationshipSchema);

module.exports = Relationship;
