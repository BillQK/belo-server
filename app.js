import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config.js";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import FollowsRoutes from "./follows/routes.js";
import LikesRoutes from "./likes/routes.js";
import PostRoutes from "./posts/routes.js";
import ProfilesRoutes from "./profiles/routes.js";
import SpotifyRoutes from "./spotify/routes.js";
import StorageRoutes from "./storage/routes.js";
import UserRoutes from "./users/routes.js";
const CONNECTION_STRING =
  process.env.DB_CONNECT_STRING || "mongodb://localhost:27017/Belo";

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch((error) => console.error("Connection error: ", error.message));

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
app.use(cookieParser());
UserRoutes(app);
PostRoutes(app);
ProfilesRoutes(app);
FollowsRoutes(app);
StorageRoutes(app);
SpotifyRoutes(app);
LikesRoutes(app);
app.listen(4000);
