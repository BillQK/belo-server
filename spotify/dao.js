import model from "./model.js";
import { ObjectId } from "mongodb";

export const createOrUpdateTokens = async (tokens) => {
  // Assuming 'userId' is the unique identifier for your tokens
  const filter = { userId: tokens.userId };
  const update = tokens;
  const options = { new: true, upsert: true };

  try {
    const result = await model.findOneAndUpdate(filter, update, options);
    return result;
  } catch (error) {
    console.error("Error in createOrUpdateTokens:", error);
    throw error; // or handle it as per your application's error handling strategy
  }
};

export const getTokensByUserId = async (userId) => {
  try {
    // Check if userId is a valid ObjectId string
    if (!ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId);
      return null;
    }

    const userToken = await model.findOne({ userId: new ObjectId(userId) });
    return userToken;
  } catch (error) {
    console.error("Error retrieving user token by userId:", error);
    return null;
  }
};
