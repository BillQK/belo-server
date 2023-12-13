import * as dao from "./dao.js";

function SpotifyRoutes(app) {
  const searchSpotifyHandler = async (req, res) => {
    let { q, accessToken } = req.query;

    try {
      const searchResult = await dao.searchSpotify(q, accessToken);
      res.json(searchResult);
    } catch (error) {
      if (error) {
        res.status(error.status).json(error.message);
      }
    }
  };

  app.get("/api/spotify", searchSpotifyHandler);
}

export default SpotifyRoutes;
