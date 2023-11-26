import * as dao from "./dao.js";

function PostRoutes(app) {
  const createPost = async (req, res) => {};
  const deletePost = async (req, res) => {};
  const findAllPosts = async (req, res) => {
    const posts = await dao.findAllPosts();
    res.json(posts);
  };
  const findPostById = async (req, res) => {};
  const updatePost = async (req, res) => {};

  app.post("/api/posts", createPost);
  app.get("/api/posts", findAllPosts);
  app.get("/api/posts/:postId", findPostById);
  app.put("/api/posts/:postId", updatePost);
  app.delete("/api/posts/:postId", deletePost);
}
export default PostRoutes;
