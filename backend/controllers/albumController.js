//import database
const database = require("../models/database");

const getAllAlbums = async (req, res) => {
  try {
    const allAlbums = await database.query("SELECT * FROM album");
    res.send(allAlbums.rows);
  } catch (err) {
    console.error(err.message);
  }
};

const addAlbum = async (req, res) => {
  try {
    const {
      album_id,
      album_name,
      album_release_date,
      total_tracks,
      image_url,
      artist_name,
      album_user_id,
    } = req.body;
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
    // //pass the error to middleware
    // next(error);
    console.error("Console Error: " + err.message);
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const album = await database.query(
      "SELECT * FROM album WHERE album_id = $1",
      [req.params.id]
    );
    if (album.rows[0] == undefined)
      return res.status(404).send("The album with the given ID was not found");
    const updateAlbum = await database.query(
      "DELETE FROM album WHERE album_id = $1",
      [req.params.id]
    );
    res.send(`Album with ID: ${req.params.id} was deleted`);
  } catch (err) {
    console.error("Console Error: " + err.message);
  }
};

module.exports = {
  getAllAlbums,
  addAlbum,
  deleteAlbum,
};
