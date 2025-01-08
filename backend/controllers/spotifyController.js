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

    const formattedResponse = [];
    if (type === "artist") {
      // iterate through each artist in the items array
      data.artists.items.forEach((artist) => {
        const artistId = artist.id;
        const artistName = artist.name || "Unknown Artist"; // get the first artist's name
        const imageUrl = artist.images[0]?.url || "No Image Available"; // get the third image URL
        // combine the data into an object and add it to the formattedResponse array
        formattedResponse.push({
          artistId,
          artistName,
          imageUrl,
        });
      });
    } else if (type === "album") {
      // iterate through each album in the items array
      data.albums.items.forEach((album) => {
        const albumId = album.id; // get the album ID
        const albumName = album.name || "Unknown Album"; // get the first artist's name
        const albumReleaseDate = album.release_date;
        const totalTracks = album.total_tracks;
        const imageUrl = album.images[2]?.url || "No Image Available"; // get the first image URL
        const artistName = album.artists[0].name;
        // combine the data into an object and add it to the formattedResponse array
        formattedResponse.push({
          albumId,
          albumName,
          albumReleaseDate,
          totalTracks,
          imageUrl,
          artistName,
        });
      });
    } else if (type === "track") {
      // iterate through each track in the items array
      data.tracks.items.forEach((track) => {
        const trackId = track.id; // get the track ID
        const trackName = track.name || "Unknown track"; // get the first track's name
        const artistName = track.artists[0].name;
        var duration = track.duration_ms;
        duration = millisToMinutesAndSeconds(duration);
        const imageUrl = track.album.images[2]?.url || "No Image Available"; // get the first image URL

        // combine the data into an object and add it to the formattedResponse array
        formattedResponse.push({
          trackId,
          trackName,
          artistName,
          duration,
          imageUrl,
        });
      });
    }

    res.json(formattedResponse);
  } catch (error) {
    console.error("Spotify API search error: ", error.message);
    return res.status(500).send("Spotify API search error: " + error.message);
  }
};

// convert duration from track parameters from milliseconds to minutes and seconds
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// export method
module.exports = { searchSpotify };
