const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotifyController");

// define route
router.get("/search", spotifyController.searchSpotify);

module.exports = router;
