import crypto from "crypto";
import { stringify } from "querystring";
import axios from "axios";
import * as stateDao from "./state/dao.js";
import * as tokenDao from "./dao.js";

function SpotifyRoutes(app) {
  app.get("/login", loginHandler);
  app.get("/callback", callbackHandler);
  app.get("/refresh_token", refreshTokenHandler);
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

// Login Handler
const loginHandler = async (req, res) => {
  const state = generateRandomString(16);
  const userId = req.session.currentUser._id;
  await stateDao.createOrUpdateStateUserIDMapping(state, userId);

  res.cookie("spotify_auth_state", state);

  const scope = "user-read-private user-read-email";
  res.redirect(
    `https://accounts.spotify.com/authorize?${stringify({
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECT_URI,
      state: state,
    })}`
  );
};

// Callback Handler
const callbackHandler = async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies.spotify_auth_state : null;

  if (state === null || state !== storedState) {
    res.redirect(
      `/${process.env.FRONTEND_URL}/#${stringify({ error: "state_mismatch" })}`
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

// Refresh Token Handler
const refreshTokenHandler = async (req, res) => {
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
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
    res.send(response.data);
  } catch (error) {
    console.error("Error in Spotify refresh token:", error);
    res.sendStatus(500);
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
        const newAccessToken = await refreshSpotifyToken(tokens.refresh_token);
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
const refreshSpotifyToken = async (refreshToken) => {
  const clientId = process.env.CLIENT_ID; // Ensure these are set in your environment
  const clientSecret = process.env.CLIENT_SECRET;
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = Buffer.from(credentials).toString("base64");

  const data = qs.stringify({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${encodedCredentials}`,
      },
    }
  );

  const newAccessToken = response.data.access_token;
  await tokenDao.updateUserTokens({
    userId: refreshToken,
    access_token: newAccessToken,
    refresh_token: refreshToken,
  });
  return newAccessToken;
};

export default SpotifyRoutes;
