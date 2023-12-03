import model from "./model.js";

export const createUserFollowsUser = (followerId, followedId) =>
  model.create({ follower: followerId, followed: followedId });
export const deleteUserFollowsUser = (followerId, followedId) =>
  model.deleteOne({ follower: followerId, followed: followedId });
export const findUsersFollowingUser = (followedId) =>
  model.find({ followed: followedId }).populate("follower").exec();
export const findUsersFollowedByUser = (followerId) =>
  model.find({ follower: followerId }).populate("followed").exec();
