import model from "./model.js";
import { ObjectId } from "mongodb";
export const createUser = (user) => model.create(user);
export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) =>
  model.findOne({ username: username });
export const findUserByCredentials = (username, password) =>
  model.findOne({ userName: username, password: password });
export const updateUser = async (userId, userUpdateData) => {
  try {
    console.log("Updating user...");
    const result = await model.updateOne(
      { _id: new ObjectId(userId) },
      { $set: userUpdateData }
    );
    console.log("Update result:", result);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
