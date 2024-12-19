const database = require("../models/database");

// get all tracks from database
const getAllTracks = async (req, res) => {
  try {
    const allTracks = await database.query("SELECT * FROM track");
    res.send(allTracks.rows);
  } catch (err) {
    console.error("Error getting all tracks: ", err.message);
    return res.status(500).send("Error getting all tracks: " + err.message);
  }
};

// add track to database
const addTrack = async (req, res) => {
  try {
    // get parameters from request
    const {
      track_id,
      track_name,
      artist_name,
      duration,
      image_url,
      track_user_id,
    } = req.body;

    // // convert duration parameter
    // var { duration } = req.body;
    // duration = millisToMinutesAndSeconds(duration);

    // add track
    const trackResponse = await database.query(
      "INSERT INTO track (track_id,track_name,artist_name,duration,image_url,track_user_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [track_id, track_name, artist_name, duration, image_url, track_user_id]
    );

    res.json(trackResponse.rows[0]);
  } catch (err) {
    console.error("Error adding track: ", err.message);
    return res.status(500).send("Error adding track: " + err.message);
  }
};

// delete track from database
const deleteTrack = async (req, res) => {
  try {
    // get track from database
    const track = await database.query(
      "SELECT * FROM track WHERE track_id = $1",
      [req.params.id]
    );

    // return error if track not found
    if (track.rows[0] == undefined)
      return res
        .status(404)
        .send(`Error: track with ID ${req.params.id} not found`);

    // delete track
    const deleteTrack = await database.query(
      "DELETE FROM track WHERE track_id = $1",
      [req.params.id]
    );

    res.send(`Track with ID: ${req.params.id} was deleted`);
  } catch (err) {
    console.error("Error deleting track: ", err.message);
    return res.status(500).send("Error deleting track: " + err.message);
  }
};

// // convert duration from track parameters from milliseconds to minutes and seconds
// function millisToMinutesAndSeconds(millis) {
//   var minutes = Math.floor(millis / 60000);
//   var seconds = ((millis % 60000) / 1000).toFixed(0);
//   return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
// }

// export methods
module.exports = {
  getAllTracks,
  addTrack,
  deleteTrack,
};
