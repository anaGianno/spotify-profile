const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// define routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.get("/search/:username", userController.getSearchUser);
router.post("/", userController.addUser);
router.delete("/:id", userController.deleteUser);
router.get("/email/:email", userController.checkSpotifyEmail);

module.exports = router;
