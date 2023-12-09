import model from "./model.js";
export const createUser = (user) => model.create(user);
export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) =>
  model.findOne({ username: username });
export const findUserByCredentials = (username, password) =>
  model.findOne({ userName: username, password: password });
export const updateUser = (userId, userUpdateData) =>
  model.updateOne({ _id: userId }, { $set: userUpdateData });
export const deleteUser = (userId) => model.deleteOne({ _id: userId });
