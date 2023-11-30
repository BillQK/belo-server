import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";
import UserRoutes from "./users/routes.js";
import PostRoutes from "./posts/routes.js";
import ProfilesRoutes from "./profiles/routes.js";
const CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/belo";
mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch((error) => console.error("Connection error: ", error.message));

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionOptions));
app.use(express.json());
UserRoutes(app);
PostRoutes(app);
ProfilesRoutes(app);

app.listen(4000);
