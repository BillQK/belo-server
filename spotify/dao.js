import axios from "axios";
import "dotenv/config.js";

var refreshToken = "";
const clientId = process.env.SPOTIFY_CLIENT_ID;

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
  try {
    const response = await axios.post(process.env.SPOTIFY_BASE_API, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        refresh_token: refreshToken,
      }),
    });
    refreshToken = response.data.access_token;
    return refreshToken; // The new access token
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
