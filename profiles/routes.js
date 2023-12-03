import * as dao from "./dao.js";

function ProfilesRoutes(app) {
  const createProfile = async (req, res) => {
    const { userId, displayName, userName, description } = req.body;

    const profile = await dao.createProfile({
      userId,
      displayName,
      userName,
      description,
    });

    res.json(profile);
  };
  const deleteProfile = async (req, res) => {};

  const findProfileById = async (req, res) => {
    try {
      // Assuming req.userId contains the ID of the profile you want to fetch
      const userId = req.params.userId;

      // Find the profile in the database
      const profile = await dao.findProfileByUserId(userId);

      // Handle the case where the profile is not found
      if (!profile) {
        return res.status(404).send({ message: "Profile not found" });
      }

      // Send the found profile as a response
      res.json(profile);
    } catch (error) {
      // Handle any errors that occur during the process
      res
        .status(500)
        .send({ message: "Error retrieving profile", error: error.message });
    }
  };
  const updateProfile = async (req, res) => {
    try {
      const { userId } = req.params; // Assuming the route parameter is named 'userId'
      const profile = req.body;
      const status = await dao.updateProfileByUserId(userId, profile);

      if (status.matchedCount === 0) {
        res.status(404).send({ message: "Profile not found" });
      } else if (status.modifiedCount === 0) {
        res.status(200).send({ message: "No changes made to the profile" });
      } else {
        res.status(200).send({ message: "Profile updated successfully" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error updating profile", error: error.message });
    }
  };

  const getProfiles = async (req, res) => {
    const profiles = await dao.findAllProfiles();
    res.json(profiles);
  };
  app.post("/api/profiles", createProfile);
  app.get("/api/profiles", getProfiles);
  app.get("/api/profiles/:userId", findProfileById);
  app.put("/api/profiles/:userId", updateProfile);
  app.delete("/api/profiles/:postId", deleteProfile);
}
export default ProfilesRoutes;
