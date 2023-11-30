import * as dao from "./dao.js";

function ProfilesRoutes(app) {
  const createProfile = async (req, res) => {
    const { userId, displayName, userName, description } = req.body;
    console.log(userId);

    const currentUser = await dao.createProfile({
      userId,
      displayName,
      userName,
      description,
    });

    res.sendStatus(201);
  };
  const deleteProfile = async (req, res) => {};

  const findProfileById = async (req, res) => {};
  const updateProfile = async (req, res) => {};

  app.post("/api/profiles", createProfile);

  app.get("/api/profiles/:userId", findProfileById);
  app.put("/api/profiles/:postId", updateProfile);
  app.delete("/api/profiles/:postId", deleteProfile);
}
export default ProfilesRoutes;
