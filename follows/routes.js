import * as dao from "./dao.js";
import * as profileDao from "../profiles/dao.js";

function FollowsRoutes(app) {
  const createUserFollowsUser = async (req, res) => {
    const { followerId, followedId } = req.params;

    if (followerId === undefined) {
      const follower = req.session.currentUser._id;
      const follow = await dao.createUserFollowsUser(follower, followedId);

      res.json(follow);
      return;
    }
    const follow = await dao.createUserFollowsUser(followerId, followedId);
    const updateFollowerCount = await profileDao.updateFollowerCount(
      followedId
    );
    const updateFollowedCount = await profileDao.updateFollowedCount(
      followerId
    );
    res.json(follow);
  };
  const deleteUserFollowsUser = async (req, res) => {
    const { followerId, followedId } = req.params;
    const status = await dao.deleteUserFollowsUser(followerId, followedId);
    const updateFollowerCount = await profileDao.deleteFollowerCount(
      followedId
    );
    const updateFollowedCount = await profileDao.deleteFollowedCount(
      followerId
    );
    res.json(status);
  };
  const findUsersFollowingUser = async (req, res) => {
    const { followedId } = req.params;
    const users = await dao.findUsersFollowingUser(followedId);
    res.json(users);
  };
  const findUsersFollowedByUser = async (req, res) => {
    const { followerId } = req.params;

    const users = await dao.findUsersFollowedByUser(followerId);

    res.json(users);
  };

  app.get("/api/users/:followedId/followers", findUsersFollowingUser);
  app.get("/api/users/:followerId/following", findUsersFollowedByUser);
  app.post("/api/users/follows/:followedId", createUserFollowsUser);
  app.post("/api/users/:followerId/follows/:followedId", createUserFollowsUser);
  app.delete(
    "/api/users/:followerId/follows/:followedId",
    deleteUserFollowsUser
  );
}

export default FollowsRoutes;
