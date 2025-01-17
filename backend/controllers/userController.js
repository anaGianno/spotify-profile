const database = require("../models/database");

// get all users from database
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await database.query("SELECT * FROM user_");
    res.send(allUsers.rows);
  } catch (err) {
    console.error("Error getting all users: ", err.message);
    return res.status(500).send("Error getting all users: " + err.message);
  }
};

// get user from database
const getUser = async (req, res) => {
  try {
    // get user using id
    const user = await database.query(
      "SELECT * FROM user_ WHERE user_id = $1",
      [req.params.id]
    );

    // return error if user not found
    if (user.rows[0] == undefined)
      return res
        .status(404)
        .send(`Error: user with ID ${req.params.id} not found`);

    res.send(user.rows[0]);
  } catch (err) {
    console.error("Error getting user: ", err.message);
    return res.status(500).send("Error getting user: " + err.message);
  }
};

// add user to database
const addUser = async (req, res) => {
  try {
    // get parameters from request
    const { user_id, user_name, type_, email, image_url } = req.body;

    // check for existing user
    const userResponse = await database.query(
      "SELECT * FROM user_ WHERE user_id = $1",
      [user_id]
    );

    // return error if user already exists
    if (userResponse.rows.length > 0) {
      return res.status(200).send("Adding user with given ID already exists");
    }

    // add user
    const newUserResponse = await database.query(
      "INSERT INTO user_ (user_id, user_name, type_, email, image_url) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [user_id, user_name, type_, email, image_url]
    );

    res.json(newUserResponse.rows[0]);
  } catch (err) {
    console.error("Error adding user: ", err.message);
    return res.status(500).send("Error adding user: " + err.message);
  }
};

// delete user from database
const deleteUser = async (req, res) => {
  try {
    // get user
    const user = await database.query(
      "SELECT * FROM user_ WHERE user_id = $1",
      [req.params.id]
    );

    // return error if user not found
    if (user.rows[0] == undefined)
      return res
        .status(404)
        .send(`Error: user with ID ${req.params.id} not found`);

    // delete user
    const deleteUser = await database.query(
      "DELETE FROM user_ WHERE user_id = $1",
      [req.params.id]
    );

    res.send(`User with ID: ${req.params.id} was deleted`);
  } catch (err) {
    console.error("Error deleting user: ", err.message);
    return res.status(500).send("Error deleting user: " + err.message);
  }
};

// check if user has spotify linked
const checkSpotifyEmail = async (req, res) => {
  try {
    // get user
    const user = await database.query(
      "SELECT * FROM user_ WHERE email = $1 AND (type_ = 'spotify' OR type_ ='spotify-google')",
      [req.params.email]
    );

    // return error if user was not found/linked
    if (user.rows.length == 0) {
      return res
        .status(404)
        .send(
          `Error: user with the email: ${req.params.email} was not found/linked with spotify.`
        );
    }

    res.send(user.rows);
  } catch (err) {
    console.error("Error checking spotify email: ", err.message);
    return res.status(500).send("Error checking spotify email: " + err.message);
  }
};

// export methods
module.exports = {
  getAllUsers,
  getUser,
  addUser,
  deleteUser,
  checkSpotifyEmail,
};
