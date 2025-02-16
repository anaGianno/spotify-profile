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

// get user tracks from database
const getUserTracks = async (req, res) => {
  try {
    const userTracks = await database.query(
      "SELECT * FROM track WHERE track_user_id = $1",
      [req.params.id]
    );
    res.send(userTracks.rows);
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
      track_release_date,
      album_type,
      album_name,
    } = req.body;

    // add track
    const trackResponse = await database.query(
      "INSERT INTO track (track_id,track_name,artist_name,duration,image_url,track_user_id,track_release_date,album_type,album_name) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
      [
        track_id,
        track_name,
        artist_name,
        duration,
        image_url,
        track_user_id,
        track_release_date,
        album_type,
        album_name,
      ]
    );

    res.json(trackResponse.rows[0]);
  } catch (err) {
    console.error("Error adding track: ", err.message);
    // check for postgreSQL exception related to the trigger
    if (err.message.includes("Cannot insert more than 10 tracks")) {
      return res
        .status(400)
        .json({ error: "Track limit reached (10 maximum)." });
    }
    return res.status(500).send("Error adding track: " + err.message);
  }
};

// delete track from database
const deleteTrack = async (req, res) => {
  try {
    const { track_id } = req.query;

    // validate inputs
    if (!track_id) {
      return res.status(400).send("Error: track_id is required");
    }

    // get track from database
    const track = await database.query(
      "SELECT * FROM track WHERE track_user_id = $1 AND track_id = $2",
      [req.params.id, track_id]
    );

    // return error if track not found
    if (track.rows[0] == undefined)
      return res
        .status(404)
        .send(
          `Error: track with ID ${track_id} and user ID ${req.params.id} not found`
        );

    // delete track
    const deleteTrack = await database.query(
      "DELETE FROM track WHERE track_user_id = $1 AND track_id = $2",
      [req.params.id, track_id]
    );

    res.send(`track with ID: ${track_id} was deleted`);
  } catch (err) {
    console.error("Error deleting track: ", err.message);
    return res.status(500).send("Error deleting track: " + err.message);
  }
};

// export methods
module.exports = {
  getAllTracks,
  getUserTracks,
  addTrack,
  deleteTrack,
};
