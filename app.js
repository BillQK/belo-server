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
import RedisStore from "connect-redis";

import { createClient } from "redis";
import CommentRoutes from "./comments/routes.js";
// MongoDB connection
const CONNECTION_STRING =
  process.env.DB_CONNECT_STRING || "mongodb://localhost:27017/Belo";
mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch((error) => console.error("Connection error: ", error.message));

const app = express();

// Initialize client.
let redisClient = createClient({
  password: process.env.REDIS_PASSWORD || "",
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || "6379",
  },
});
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
});

app.use(cookieParser());

const sessionOptions = {
  store: redisStore,
  secret: "any string",
  resave: false,
  saveUninitialized: true,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    secure: true,
    maxAge: 18000 * 1000,
    sameSite: "none",
  };
}
app.use(session(sessionOptions));
// Other middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

// Routes
UserRoutes(app);
PostRoutes(app);
ProfilesRoutes(app);
FollowsRoutes(app);
StorageRoutes(app);
SpotifyRoutes(app);
LikesRoutes(app);
CommentRoutes(app);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
