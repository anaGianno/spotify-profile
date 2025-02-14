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
      )}&type=${type}&limit=10&offset=0`,
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
        // get artist data
        const artist_id = artist.id;
        const artist_name = artist.name || "Unknown Artist";
        const image_url = artist.images[0]?.url || "No Image Available";
        const genres = artist.genres;
        const followers = artist.followers.total;
        // combine the data into an object and add it to the formattedResponse array
        formattedResponse.push({
          artist_id,
          artist_name,
          image_url,
          genres,
          followers,
        });
      });
    } else if (type === "album") {
      // iterate through each album in the items array
      data.albums.items.forEach((album) => {
        // get album data
        const album_id = album.id;
        const album_name = album.name || "Unknown Album";
        const album_release_date = album.release_date;
        const total_tracks = album.total_tracks;
        const image_url = album.images[0]?.url || "No Image Available";
        const artist_name = album.artists[0].name;
        // combine the data into an object and add it to the formattedResponse array
        formattedResponse.push({
          album_id,
          album_name,
          album_release_date,
          total_tracks,
          image_url,
          artist_name,
        });
      });
    } else if (type === "track") {
      // iterate through each track in the items array
      data.tracks.items.forEach((track) => {
        // get track data
        const track_id = track.id;
        const track_name = track.name || "Unknown track";
        const artist_name = track.artists[0].name;
        var duration = track.duration_ms;
        duration = millisToMinutesAndSeconds(duration);
        const image_url = track.album.images[0]?.url || "No Image Available";
        const track_release_date = track.album.release_date;
        const album_type = track.album.type;
        const album_name = track.album.name;
        // combine the data into an object and add it to the formattedResponse array
        formattedResponse.push({
          track_id,
          track_name,
          artist_name,
          duration,
          image_url,
          track_release_date,
          album_type,
          album_name,
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
