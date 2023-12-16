import model from "./model.js";

export const createOrUpdateStateUserIDMapping = async (state, userId) => {
  const filter = { state: state }; // Using 'state' as the unique identifier
  const update = { userId: userId };
  const options = { new: true, upsert: true };

  try {
    const result = await model.findOneAndUpdate(filter, update, options);
    return result;
  } catch (error) {
    console.error("Error in createOrUpdateStateUserIDMapping:", error);
    throw error; // or handle it as per your application's error handling strategy
  }
};

export const retrieveUserIDFromState = async (state) => {
  try {
    const userDocument = await model.findOne({ state: state });
    if (!userDocument) {
      // Handle the case where no document is found
      console.log("No user found for the given state.");
      return null;
    }
    return userDocument.userId; // Extracting userId from the document
  } catch (error) {
    // Handle any errors that occur during the query
    console.error("Error retrieving user by state:", error);
    return null;
  }
};

export const clearStateUserIDMapping = (state) =>
  model.deleteOne({ state: state });
