import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    role: {
      type: String,
      enum: ["ADMIN", "MEMBER", "DEV"],
      default: "MEMBER",
    },
    accesstoken: String,
    restricted: { type: Boolean, default: false },
  },
  { collection: "users" }
);
export default userSchema;
