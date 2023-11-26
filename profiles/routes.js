import * as dao from "./dao.js";

function ProfilesRoutes(app) {
  const createProfile = async (req, res) => {};
  const deleteProfile = async (req, res) => {};

  const findProfileById = async (req, res) => {};
  const updateProfile = async (req, res) => {};

  app.post("/api/posts", createProfile);

  app.get("/api/posts/:userId", findProfileById);
  app.put("/api/posts/:postId", updateProfile);
  app.delete("/api/posts/:postId", deleteProfile);
}
export default ProfileRoutes;
