const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotifyController");

router.get("/search", spotifyController.searchSpotify);

module.exports = router;

// router.get("/search", async (req, res) => {
//   const { query, type } = req.query;
//   const credentials = Buffer.from(
//     `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
//   ).toString("base64");

//   console.log("Client ID:", process.env.SPOTIFY_CLIENT_ID);
//   console.log("Client Secret:", process.env.SPOTIFY_CLIENT_SECRET);

//   try {
//     const tokenResponse = await fetch(
//       "https://accounts.spotify.com/api/token",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Basic ${credentials}`,
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: "grant_type=client_credentials",
//       }
//     );

//     const tokenData = await tokenResponse.json();

//     if (tokenData.access_token) {
//       console.log("Spotify Access Token:", tokenData.access_token);
//     } else {
//       console.error("Error retrieving Spotify token:", tokenData);
//     }

//     console.log("Query:", query);
//     console.log("Type:", type);
//     console.log(
//       "Fetch: ",
//       `https://api.spotify.com/v1/search?q=${encodeURIComponent(
//         query
//       )}&type=${type}&limit=5&offset=0`
//     );

//     const response = await fetch(
//       `https://api.spotify.com/v1/search?q=${encodeURIComponent(
//         query
//       )}&type=${type}&limit=5&offset=0`,
//       {
//         method: "GET",
//         headers: { Authorization: `Bearer ${tokenData.access_token}` },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Spotify API Error: ${response.statusText}`);
//     }

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("Spotify API Search Error: ", error.message);
//   }
// });
