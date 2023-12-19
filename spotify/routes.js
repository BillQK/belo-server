import crypto from "crypto";
import { stringify } from "querystring";
import axios from "axios";
import * as stateDao from "./state/dao.js";
import * as tokenDao from "./dao.js";

function SpotifyRoutes(app) {
  app.get("/login", loginHandler);
  app.get("/callback", callbackHandler);
  app.get("/search", searchSpotify);
}

// Utility function to generate random string
const generateRandomString = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

// Utility function to create Authorization header
const getAuthHeader = (clientId, clientSecret) => {
  const credentials = `${clientId}:${clientSecret}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
};

const loginHandler = async (req, res) => {
  console.log(req);
  const state = generateRandomString(16);
  if (!req.session.currentUser) {
    return res.status(401).send("No active session");
  }
  const userId = req.session.currentUser._id;
  await stateDao.createOrUpdateStateUserIDMapping(state, userId);

  const authUrl = `https://accounts.spotify.com/authorize?${stringify({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: "user-read-private user-read-email",
    redirect_uri: process.env.REDIRECT_URI,
    state: state,
  })}`;
  console.log(authUrl);
  res.json({ authUrl, state });
};

// Callback Handler
const callbackHandler = async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies.spotify_auth_state : null;

  if (state === null || state !== storedState) {
    res.redirect(
      `${process.env.FRONTEND_URL}/#${stringify({ error: "state_mismatch" })}`
    );
  } else {
    res.clearCookie("spotify_auth_state");
    const authOptions = {
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: stringify({
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: getAuthHeader(
          process.env.SPOTIFY_CLIENT_ID,
          process.env.SPOTIFY_CLIENT_SECRET
        ),
      },
    };

    try {
      const response = await axios(authOptions);
      const { access_token, refresh_token } = response.data;

      const userId = await stateDao.retrieveUserIDFromState(state);
      await tokenDao.createOrUpdateTokens({
        userId,
        access_token,
        refresh_token,
      });

      res.redirect(`${process.env.FRONTEND_URL}/Dashboard/feed`);
    } catch (error) {
      console.error("Error in Spotify callback:", error);
      res.redirect(
        `/${process.env.FRONTEND_URL}/#${stringify({ error: "invalid_token" })}`
      );
    }
  }
};

// Search Spotify
const searchSpotify = async (req, res) => {
  const userId = req.query.userId;
  const query = req.query.q;
  const type = req.query.type;

  let tokens = await tokenDao.getTokensByUserId(userId);

  try {
    await performSpotifySearch(query, tokens.access_token, type, res);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await refreshSpotifyToken(
          tokens.refresh_token,
          userId
        );
        await performSpotifySearch(query, newAccessToken, res);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        res.status(500).send("Internal Server Error");
      }
    } else {
      console.error("Error during Spotify search:", error);
      res.status(500).send("Internal Server Error");
    }
  }
};

const performSpotifySearch = async (query, accessToken, type, res) => {
  const response = await axios.get(process.env.SPOTIFY_BASE_API, {
    params: { q: query, type: type },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  res.json(response.data.albums.items);
};

// Refresh Spotify Token
const refreshSpotifyToken = async (refreshToken, userId) => {
  console.log("Refreshing Spotify Token");
  const clientId = process.env.SPOTIFY_CLIENT_ID; // Ensure these are set in your environment
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
    json: true,
  };

  const response = await axios.post(authOptions);

  const newAccessToken = response.body.access_token;
  const newRefreshToken = response.body.refresh_token;
  await tokenDao.createOrUpdateTokens({
    userId: userId,
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
  });
  return newAccessToken;
};

export default SpotifyRoutes;
