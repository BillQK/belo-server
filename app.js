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
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
});

app.use(cookieParser());

// Use Redis to store session
app.use(
  session({
    store: redisStore,
    secret: "any string",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", // Adjust as per your requirement
    },
  })
);
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

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
