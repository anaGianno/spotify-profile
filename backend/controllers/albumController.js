const database = require("../models/database");

// get all albums from database
const getAllAlbums = async (req, res) => {
  try {
    const allAlbums = await database.query("SELECT * FROM album");
    res.send(allAlbums.rows);
  } catch (err) {
    console.error("Error getting all albums: ", err.message);
    return res.status(500).send("Error getting all albums: " + err.message);
  }
};

// get user albums from database
const getUserAlbums = async (req, res) => {
  try {
    const userAlbums = await database.query(
      "SELECT * FROM album WHERE album_user_id = $1",
      [req.params.id]
    );
    res.send(userAlbums.rows);
  } catch (err) {
    console.error("Error getting all albums: ", err.message);
    return res.status(500).send("Error getting all albums: " + err.message);
  }
};

// add album to database
const addAlbum = async (req, res) => {
  try {
    // get album parameters from request
    const {
      album_id,
      album_name,
      album_release_date,
      total_tracks,
      image_url,
      artist_name,
      album_user_id,
    } = req.body;

    // add album
    const newAlbum = await database.query(
      "INSERT INTO album (album_id,album_name,album_release_date,total_tracks,image_url,artist_name,album_user_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        album_id,
        album_name,
        album_release_date,
        total_tracks,
        image_url,
        artist_name,
        album_user_id,
      ]
    );

    res.json(newAlbum.rows[0]);
  } catch (err) {
    console.error("Error adding album: ", err.message);
    return res.status(500).send("Error adding album: " + err.message);
  }
};

// delete album from database
const deleteAlbum = async (req, res) => {
  try {
    const { album_id } = req.query;

    // validate inputs
    if (!album_id) {
      return res.status(400).send("Error: album_id is required");
    }

    // get album from database
    const album = await database.query(
      "SELECT * FROM album WHERE album_user_id = $1 AND album_id = $2",
      [req.params.id, album_id]
    );

    // return error if album not found
    if (album.rows[0] == undefined)
      return res
        .status(404)
        .send(
          `Error: album with ID ${album_id} and user ID ${req.params.id} not found`
        );

    // delete album
    const deleteAlbum = await database.query(
      "DELETE FROM album WHERE album_user_id = $1 AND album_id = $2",
      [req.params.id, album_id]
    );

    res.send(`album with ID: ${album_id} was deleted`);
  } catch (err) {
    console.error("Error deleting album: ", err.message);
    return res.status(500).send("Error deleting album: " + err.message);
  }
};

// export all methods
module.exports = {
  getAllAlbums,
  getUserAlbums,
  addAlbum,
  deleteAlbum,
};
