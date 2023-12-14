import * as dao from "./dao.js";
import * as profileDao from "../profiles/dao.js";
function PostRoutes(app) {
  const createPost = async (req, res) => {
    const { userId, post } = req.body;
    const spotifyContent = post.spotifyContent;
    const description = post.description;
    const data = await dao.createPost({
      userId,
      spotifyContent,
      description,
    });
    const response = await profileDao.increaseNumberOfPost(userId);
    res.status(201).json(data);
  };

  const deletePost = async (req, res) => {
    const postId = req.params.postId;

    try {
      const response = await profileDao.decreaseNumberOfPost(postId);
      const result = await dao.deletePost(postId);
      console.log("delete post", result);
      if (!result) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(200);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting post", error: error.message });
    }
  };

  const findAllPosts = async (req, res) => {
    const posts = await dao.findAllPosts();
    res.json(posts);
  };
  const findAllPostsByUserId = async (req, res) => {
    const { userId } = req.params;
    const posts = await dao.findAllPostsByUserId(userId);
    res.json(posts);
  };
  const updatePost = async (req, res) => {
    const postId = req.params.postId;
    const updateData = req.body; // Assuming the updated data is sent in the request body
    console.log(updateData);
    try {
      const updatedPost = await dao.updatePost(postId, updateData);
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(updatedPost);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating post", error: error.message });
    }
  };

  app.post("/api/posts", createPost);
  app.get("/api/posts", findAllPosts);
  //app.get("/api/posts/:postId", findPostById);
  app.put("/api/posts/:postId", updatePost);
  app.delete("/api/posts/:postId", deletePost);
  app.get("/api/users/:userId/posts", findAllPostsByUserId);
}
export default PostRoutes;
