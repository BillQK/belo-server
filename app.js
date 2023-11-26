import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserRoutes from "./users/routes.js";
import PostRoutes from "./posts/routes.js";
const CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/belo";
mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch((error) => console.error("Connection error: ", error.message));

const app = express();
app.use(cors());
app.use(express.json());
UserRoutes(app);
PostRoutes(app);

app.listen(4000);
