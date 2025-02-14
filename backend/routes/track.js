const express = require("express");
const router = express.Router();
const trackController = require("../controllers/trackController");

// define routes
router.get("/", trackController.getAllTracks);
router.get("/:id", trackController.getUserTracks);
router.post("/", trackController.addTrack);
router.delete("/:id", trackController.deleteTrack);

module.exports = router;
