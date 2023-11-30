import model from "./model.js";

export const createProfile = (profile) => model.create(profile);
export const findProfileByUserId = (userId) => model.findById(userId);
export const findProfileByProfileId = (postId) =>
  model.findOne({ profileId: profileId });
export const updateProfile = (profileId, profile) =>
  model.updateOne({ _id: profileId }, { $set: profile });
export const deletePost = (profileId) => model.deleteOne({ _id: profileId });
