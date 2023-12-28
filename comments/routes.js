import * as dao from "./dao.js";

function CommentRoutes(app) {
  const createComment = async (req, res) => {
    const { userId, postParentId, text } = req.body;
    const data = await dao.createComment({
      userId,
      postParentId,
      text,
    });

    // await postDao.increaseNumberOfComment(userId);
    res.status(201).json(data);
  };

  const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;

    try {
      const response = await postDao.decreaseNumberOfComment(commentId);
      const result = await dao.deleteComment(commentId);
      console.log("delete comment", result);
      if (!result) {
        return res.stauts(404).json({ message: "Comment not found" });
      }
      res.json(200);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting comment", error: error.message });
    }
  };

  const findCommentsByPostId = async (req, res) => {
    const postId = req.params.postId;
    console.log("findCommentsByPostId", postId);
    try {
      const comments = await dao.findAllCommentByPostId(postId);
      console.log(comments);
      res.json(comments);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error finding comments", error: error.message });
    }
  };

  app.post("/api/comments", createComment);
  app.get("/api/comments/:postId", findCommentsByPostId);
  app.delete("/api/comments/:commentId", deleteComment);
}

export default CommentRoutes;
