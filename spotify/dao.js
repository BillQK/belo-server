import axios from "axios";
import qs from "qs"; // qs is a querystring parsing library
import "dotenv/config.js";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export const searchSpotify = async (query, accessToken) => {
  // Make a request to the Spotify API with the provided access token
  try {
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
    console.log(response);
    return response.data.albums.items;
  } catch (error) {
    console.log(error);
    throw error
  }
};
