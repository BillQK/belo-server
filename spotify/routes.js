function SpotifyRoutes(app) {
  const searchSpotifyHandler = async (req, res) => {
    let { q, accessToken } = req.query;

    try {
      const searchResult = await dao.searchSpotify(q, accessToken);
      res.json(searchResult);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        res.status(error.response.status).json(error.response.data);
      }
    }
  };

  app.get("/api/spotify", searchSpotifyHandler);
}

export default SpotifyRoutes;
