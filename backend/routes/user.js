const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.put("/", userController.addUser);
router.delete("/:id", userController.deleteUser);
router.get("/email/:email", userController.checkSpotifyEmail);

module.exports = router;

// router.get("/users", async (req, res) => {
//   try {
//     const allUsers = await database.query("SELECT * FROM user_");
//     res.send(allUsers.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// router.get("/users/email/:email", async (req, res) => {
//   try {
//     const user = await database.query(
//       "SELECT * FROM user_ WHERE email = $1 AND (type_ = 'spotify' OR type_ ='spotify-google')",
//       [req.params.email]
//     );

//     console.log("user: ", user);
//     // Check if any rows are returned
//     if (user.rows.length == 0) {
//       return res.status(404).json({
//         error: `The user with the email: ${req.params.email} was not found/linked with spotify.`,
//       });
//       // return res.send("No spotify user with this email");
//     }

//     res.send(user.rows);
//   } catch (err) {
//     // //pass the error to middleware
//     // next(error);
//     console.error("Console Error: " + err.message);
//   }
// });

// router.get("/users/:id", async (req, res) => {
//   try {
//     const user = await database.query(
//       "SELECT * FROM user_ WHERE user_id = $1",
//       [req.params.id]
//     );
//     console.log("user1234 req.params.id : " + req.params.id);
//     console.log("user1234 : " + JSON.stringify(user, null, 2));
//     console.log("user1234 rows : " + JSON.stringify(user.rows, null, 2));
//     if (user.rows[0] == undefined)
//       return res.status(404).send("The user with the given ID was not found");
//     res.send(user.rows[0]);
//   } catch (err) {
//     console.error("Console Error: " + err.message);
//   }
// });

// router.post("/users", async (req, res) => {
//   try {
//     //check for username
//     // const { error } = validateUser(req.body);
//     // if (error) return res.status(400).send(error.details[0].message);
//     // if (error) return res.status(400).send(error);
//     //get username
//     const { user_id, user_name, type_, email, image_url } = req.body;
//     const user = await database.query(
//       "SELECT * FROM user_ WHERE user_id = $1",
//       [user_id]
//     );

//     console.log("post user: ", user);
//     // Check if any rows are returned
//     if (user.rows.length > 0) {
//       if (type_ === "spotify" || type_ === "google") {
//         return res
//           .status(403)
//           .send("The user with the given ID was already found");
//       }
//     }

//     const newUser = await database.query(
//       "INSERT INTO user_ (user_id, user_name, type_, email, image_url) VALUES($1,$2,$3,$4,$5) RETURNING *",
//       [user_id, user_name, type_, email, image_url]
//     );
//     res.json(newUser.rows[0]);
//   } catch (err) {
//     // //pass the error to middleware
//     // next(error);
//     console.error("Console Error: " + err.message);
//   }
// });

// router.delete("/users/:id", async (req, res) => {
//   try {
//     const user = await database.query(
//       "SELECT * FROM user_ WHERE user_id = $1",
//       [req.params.id]
//     );
//     if (user.rows[0] == undefined)
//       return res.status(404).send("The user with the given ID was not found");
//     const updateUser = await database.query(
//       "DELETE FROM user_ WHERE user_id = $1",
//       [req.params.id]
//     );
//     res.send(`User with ID: ${req.params.id} was deleted`);
//   } catch (err) {
//     console.error("Console Error: " + err.message);
//   }
// });

// //ensure a username has been entered
// function validateUser(user) {
//   const schema = Joi.object({
//     // email: Joi.string().required(),
//     allowUnknown: true,
//   });

//   return schema.validate(user);
// }
