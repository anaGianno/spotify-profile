const database = require("../models/database");

// get all artists from database
const getAllArtists = async (req, res) => {
  try {
    const allArtists = await database.query("SELECT * FROM artist");
    res.send(allArtists.rows);
  } catch (err) {
    console.error("Error getting all artists: ", err.message);
    return res.status(500).send("Error getting all artists: " + err.message);
  }
};

// get user artists from database
const getUserArtists = async (req, res) => {
  try {
    const userArtists = await database.query(
      "SELECT * FROM artist WHERE artist_user_id = $1",
      [req.params.id]
    );
    res.send(userArtists.rows);
  } catch (err) {
    console.error("Error getting all Artists: ", err.message);
    return res.status(500).send("Error getting all Artists: " + err.message);
  }
};

// add artist to database
const addArtist = async (req, res) => {
  try {
    // get artist parameters from request
    const {
      artist_id,
      artist_name,
      image_url,
      artist_user_id,
      genres,
      followers,
    } = req.body;

    const updatedGenres =
      !genres || genres.length === 0 ? ["not available"] : genres;

    // add artist into database
    const newArtist = await database.query(
      "INSERT INTO artist (artist_id,artist_name,image_url,artist_user_id,genres,followers) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [
        artist_id,
        artist_name,
        image_url,
        artist_user_id,
        updatedGenres,
        followers,
      ]
    );

    res.json(newArtist.rows[0]);
  } catch (err) {
    console.error("Error adding artist: ", err.message);
    // check for postgres exception related to the trigger
    if (err.message.includes("Cannot insert more than 10 artists")) {
      return res
        .status(400)
        .json({ error: "Item limit reached (10 maximum)." });
    }
    return res.status(500).send("Error adding artist: " + err.message);
  }
};

// delete artist from database
const deleteArtist = async (req, res) => {
  try {
    const { artist_id } = req.query;

    // validate inputs
    if (!artist_id) {
      return res.status(400).send("Error: artist_id is required");
    }

    // get artist from database
    const artist = await database.query(
      "SELECT * FROM artist WHERE artist_user_id = $1 AND artist_id = $2",
      [req.params.id, artist_id]
    );

    // return error if artist not found
    if (artist.rows[0] == undefined)
      return res
        .status(404)
        .send(
          `Error: Artist with ID ${artist_id} and user ID ${req.params.id} not found`
        );

    // delete artist
    const deleteArtist = await database.query(
      "DELETE FROM artist WHERE artist_user_id = $1 AND artist_id = $2",
      [req.params.id, artist_id]
    );

    res.send(`Artist with ID: ${artist_id} was deleted`);
  } catch (err) {
    console.error("Error deleting artist: ", err.message);
    return res.status(500).send("Error deleting artist: " + err.message);
  }
};

// export all methods
module.exports = {
  getAllArtists,
  getUserArtists,
  addArtist,
  deleteArtist,
};
