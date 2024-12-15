//import database
const database = require("../models/database");

//artist routes
const getAllArtists = async (req, res) => {
  try {
    const allArtists = await database.query("SELECT * FROM artist");
    res.send(allArtists.rows);
  } catch (err) {
    console.error(err.message);
  }
};

const addArtist = async (req, res) => {
  try {
    const { artist_id, artist_name, image_url, artist_user_id } = req.body;
    const newArtist = await database.query(
      "INSERT INTO artist (artist_id,artist_name,image_url,artist_user_id) VALUES($1,$2,$3,$4) RETURNING *",
      [artist_id, artist_name, image_url, artist_user_id]
    );
    res.json(newArtist.rows[0]);
  } catch (err) {
    // //pass the error to middleware
    // next(error);
    console.error("Console Error: " + err.message);
  }
};

const deleteArtist = async (req, res) => {
  try {
    const artist = await database.query(
      "SELECT * FROM artist WHERE artist_id = $1",
      [req.params.id]
    );
    if (artist.rows[0] == undefined)
      return res.status(404).send("The artist with the given ID was not found");
    const updateArtist = await database.query(
      "DELETE FROM artist WHERE artist_id = $1",
      [req.params.id]
    );
    res.send(`Artist with ID: ${req.params.id} was deleted`);
  } catch (err) {
    console.error("Console Error: " + err.message);
  }
};

module.exports = {
  getAllArtists,
  addArtist,
  deleteArtist,
};
