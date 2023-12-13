import * as dao from "./dao.js";

function SpotifyRoutes(app) {
  const searchSpotifyHandler = async (req, res) => {
    const { q, accessToken } = req.query;

    // Check if a query is provided
    if (!q || q.trim() === "") {
      // If the query is empty, return a default response (e.g., empty array)
      res.json([]);
      return;
    }

    try {
      const searchResult = await dao.searchSpotify(q, accessToken);
      res.json(searchResult);
    } catch (error) {
      console.error(error);
      const statusCode = error.status || 500; // Use a default error code if none is provided
      res.status(statusCode).json({ error: error.message });
    }
  };

  app.get("/api/spotify", searchSpotifyHandler);
}

export default SpotifyRoutes;
