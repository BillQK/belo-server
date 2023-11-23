import express from "express";
import mongoose from "mongoose";
import UserRoutes from "./users/routes.js";
import UserModel from "./users/model.js"; // Replace with the actual path to your model file
mongoose.connect("mongodb://127.0.0.1:27017/belo");

const app = express();

app.use(express.json());
UserRoutes(app);

app.listen(4000);
