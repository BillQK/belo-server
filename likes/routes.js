import * as dao from "./dao.js";

function LikesRoutes(app) {
  const createUserLikesPost = async (req, res) => {
    const { userId, postId } = req.params;
    if (userId === undefined) {
      const user = req.session.currentUser._id;
      const like = await dao.createUserLikesPost(user, postId);
      res.json(like);
      return;
    }
    const like = await dao.createUserLikesPost(userId, postId);
    res.json(like);
  };
  const deleteUserLikesPost = async (req, res) => {
    const { userId, postId } = req.params;
    if (userId === undefined) {
      const user = req.session.currentUser._id;
      const status = await dao.deleteUserLikesPost(userId, postId);
      res.json(status);
      return;
    }
    const status = await dao.deleteUserLikesPost(userId, postId);
    res.json(status);
  };
  const findUsersLikedPost = async (req, res) => {
    const { postId } = req.params;
    const users = await dao.findUsersLikedPost(postId);
    res.json(users);
  };
  const findPostsLikedByUser = async (req, res) => {
    const { userId } = req.params;
    const posts = await dao.findPostsLikedByUser(userId);
    res.json(post);
  };

  app.get("/api/likes/user/:userId", findPostsLikedByUser);
  app.get("/api/likes/post/:postId", findUsersLikedPost);
  app.post("/api/likes/:userId/:postId", createUserLikesPost);
  app.delete("/api/likes/:userId/:postId", deleteUserLikesPost);

  app.delete("/api/users/:userId/likes/:albumId", deleteUserLikesPost);
  app.delete("/api/users/likes/:albumId", deleteUserLikesPost);
  app.get("/api/albums/:albumId/likes", findUsersLikedPost);
  app.get("/api/users/:userId/likes", findPostsLikedByUser);

  // app.post("/api/users/likes/:albumId/title/:title", createUserLikesPost);
}

export default LikesRoutes;
