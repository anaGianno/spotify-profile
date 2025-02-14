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

const getSearchUser = async (req, res) => {
  try {
    const user_name = req.params.username;
    const search_user_name = `%${user_name}%`;
    // get user using id
    const user = await database.query(
      "SELECT * FROM user_ WHERE user_name ILIKE $1",
      [search_user_name]
    );

    // return error if user not found
    if (user.rows[0] == undefined)
      return res
        .status(404)
        .send(`Error: user with username ${user_name} not found`);

    res.send(user.rows);
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

    // return 204 no content if user already exists
    if (userResponse.rows.length > 0) {
      return res.status(204).send("Adding user with given ID already exists");
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

    // return 204 no content if user was not found/linked
    if (user.rows.length == 0) {
      return res.status(204).send(user.rows);
    }

    res.status(200).send(user.rows);
  } catch (err) {
    console.error("Error checking spotify email: ", err.message);
    return res.status(500).send("Error checking spotify email: " + err.message);
  }
};

// export methods
module.exports = {
  getAllUsers,
  getUser,
  getSearchUser,
  addUser,
  deleteUser,
  checkSpotifyEmail,
};
