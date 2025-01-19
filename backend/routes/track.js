const express = require("express");
const router = express.Router();
const trackController = require("../controllers/trackController");

// define routes
router.get("/", trackController.getAllTracks);
router.get("/:id", trackController.getUserTracks);
router.post("/", trackController.addTrack);
router.delete("/:id", trackController.deleteTrack);

module.exports = router;

//track routes
// router.get("/tracks", async (req, res) => {
//   try {
//     const allTracks = await database.query("SELECT * FROM track");
//     res.send(allTracks.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// router.post("/tracks", async (req, res) => {
//   try {
//     const { track_id, track_name, artist_name, image_url, track_user_id } =
//       req.body;
//     var { duration } = req.body;
//     duration = millisToMinutesAndSeconds(duration);
//     const newTrack = await database.query(
//       "INSERT INTO track (track_id,track_name,artist_name,duration,image_url,track_user_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
//       [track_id, track_name, artist_name, duration, image_url, track_user_id]
//     );
//     res.json(newTrack.rows[0]);
//   } catch (err) {
//     // //pass the error to middleware
//     // next(error);
//     console.error("Console Error: " + err.message);
//   }
// });

// router.delete("/tracks/:id", async (req, res) => {
//   try {
//     const track = await database.query(
//       "SELECT * FROM track WHERE track_id = $1",
//       [req.params.id]
//     );
//     if (track.rows[0] == undefined)
//       return res.status(404).send("The track with the given ID was not found");
//     const updateUser = await database.query(
//       "DELETE FROM track WHERE track_id = $1",
//       [req.params.id]
//     );
//     res.send(`Track with ID: ${req.params.id} was deleted`);
//   } catch (err) {
//     console.error("Console Error: " + err.message);
//   }
// });

// function millisToMinutesAndSeconds(millis) {
//   var minutes = Math.floor(millis / 60000);
//   var seconds = ((millis % 60000) / 1000).toFixed(0);
//   return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
// }
