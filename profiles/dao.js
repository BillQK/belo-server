import model from "./model.js";

export const createProfile = (profile) => model.create(profile);
export const findProfileByProfileId = (profileId) => model.findById(profileId);
export const findProfileByUserId = (userId) =>
  model.findOne({ userId: userId });
export const updateProfileByUserId = (userId, profile) =>
  model.updateOne({ userId: userId }, { $set: profile });
export const deletePost = (profileId) => model.deleteOne({ _id: profileId });
export const findAllProfiles = () => model.find().limit(10);
