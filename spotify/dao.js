import axios from "axios";
import "dotenv/config.js";

var refreshToken = "";
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export const searchSpotify = async (query, accessToken) => {
  // Make a request to the Spotify API with the provided access token
  refreshToken = accessToken;
  const response = await axios.get(process.env.SPOTIFY_BASE_API, {
    params: {
      q: query,
      type: "album",
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.albums.items;
};

export const refreshSpotifyToken = async () => {
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = Buffer.from(credentials).toString("base64");

  const data = qs.stringify({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  try {
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
    // Save or process the new access token as needed
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
