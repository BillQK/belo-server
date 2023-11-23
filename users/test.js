import UserModel from "./model.js"; // Replace with the actual path to your model file

const createUser = async (userData) => {
  try {
    const user = new UserModel(userData);
    await user.save();
    console.log("New user has been saved:", user);
  } catch (error) {
    console.error("Error saving new user:", error);
  }
};

const sampleUserData = {
  username: "newuser",
  password: "newpassword", // Remember to hash passwords in production
  firstName: "New",
  lastName: "User",
  email: "newuser@example.com",
};
console.log("Here");
createUser(sampleUserData);
