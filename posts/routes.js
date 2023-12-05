import * as dao from "./dao.js";

function PostRoutes(app) {
  const createPost = async (req, res) => {
    const { userId, spotifyContent, description, likesCount } = req.body;
    const post = await dao.createPost({
      userId,
      spotifyContent,
      description,
      likesCount,
    });
    res.status(201).json(post);
  };
  const deletePost = async (req, res) => {};
  const findAllPosts = async (req, res) => {
    const posts = await dao.findAllPosts();
    res.json(posts);
  };
  const findAllPostsByUserId = async (req, res) => {
    const { userId } = req.params;
    const posts = await dao.findAllPostsByUserId(userId);
    res.json(posts);
  };
  const updatePost = async (req, res) => {};

  app.post("/api/posts", createPost);
  app.get("/api/posts", findAllPosts);
  //app.get("/api/posts/:postId", findPostById);
  app.put("/api/posts/:postId", updatePost);
  app.delete("/api/posts/:postId", deletePost);
  app.get("/api/users/:userId/posts", findAllPostsByUserId);
}
export default PostRoutes;
