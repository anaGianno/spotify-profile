const express = require("express");
const router = express.Router();
const albumController = require("../controllers/albumController");

// define routes
router.get("/", albumController.getAllAlbums);
router.get("/:id", albumController.getUserAlbums);
router.post("/", albumController.addAlbum);
router.delete("/:id", albumController.deleteAlbum);

module.exports = router;
