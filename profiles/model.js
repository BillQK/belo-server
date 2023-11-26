import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("profiles", schema);
export default model;
