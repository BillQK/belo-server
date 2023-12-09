import * as dao from "../spotify/dao.js";

function SpotifyRoutes(app) {
  const searchSpotifyHandler = async (req, res) => {
    let { q, accessToken } = req.query;

    try {
      const searchResult = await dao.searchSpotify(q, accessToken);
      res.json(searchResult);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Refresh the token
        accessToken = await dao.refreshSpotifyToken();
        if (!accessToken) {
          return res.status(401).json({ error: "Unable to refresh token" });
        }
        // Retry the request with the new token
        try {
          const searchResult = await dao.searchSpotify(q, accessToken);
          res.json(searchResult);
        } catch (retryError) {
          console.error("Error making API call:", retryError);
          res.status(retryError.response.status).json(retryError.response.data);
        }
      } else {
        console.error("Error making API call:", error);
        res.status(error.response.status).json(error.response.data);
      }
    }
  };

  app.get("/api/spotify", searchSpotifyHandler);
}

export default SpotifyRoutes;
