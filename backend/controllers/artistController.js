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
    const { artist_id, artist_name, image_url, artist_user_id } = req.body;

    // add artist into database
    const newArtist = await database.query(
      "INSERT INTO artist (artist_id,artist_name,image_url,artist_user_id) VALUES($1,$2,$3,$4) RETURNING *",
      [artist_id, artist_name, image_url, artist_user_id]
    );

    res.json(newArtist.rows[0]);
  } catch (err) {
    console.error("Error adding artist: ", err.message);
    return res.status(500).send("Error adding artist: " + err.message);
  }
};

// delete artist from database
const deleteArtist = async (req, res) => {
  try {
    // get album from database
    const artist = await database.query(
      "SELECT * FROM artist WHERE artist_id = $1",
      [req.params.id]
    );

    // return error if artist not found
    if (artist.rows[0] == undefined)
      return res
        .status(404)
        .send(`Error: user with ID ${req.params.id} not found`);

    // delete artist
    const deleteArtist = await database.query(
      "DELETE FROM artist WHERE artist_id = $1",
      [req.params.id]
    );

    res.send(`Artist with ID: ${req.params.id} was deleted`);
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
