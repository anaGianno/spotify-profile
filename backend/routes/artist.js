const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");

// define routes
router.get("/", artistController.getAllArtists);
router.get("/:id", artistController.getUserArtists);
router.post("/", artistController.addArtist);
router.delete("/:id", artistController.deleteArtist);

module.exports = router;
