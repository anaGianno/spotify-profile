const database = require("../models/database");

// search spotify for album/artist/track
const searchSpotify = async (req, res) => {
  // get parameters from request
  const { query, type } = req.query;

  // get client id and secret
  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    // fetch spotify token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData = await tokenResponse.json();

    // return error if fetch to spotify failed
    if (!tokenData.access_token) {
      const errorDetails = await tokenResponse.json();
      console.error("Error with Spotify token exchange: ", errorDetails);
      return res.status(tokenResponse.status).json(errorDetails);
    }

    // fetch query response
    const searchReponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=${type}&limit=5&offset=0`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    // return error if query unsuccessful
    if (!searchReponse.ok) {
      return res
        .status(searchReponse.status)
        .send("Error: failed to fetch spotify profile");
    }

    const data = await searchReponse.json();
    res.json(data);
  } catch (error) {
    console.error("Spotify API search error: ", error.message);
    return res.status(500).send("Spotify API search error: " + error.message);
  }
};

// export method
module.exports = { searchSpotify };
