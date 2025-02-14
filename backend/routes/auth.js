const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

//google oauth2
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

//configure google strategy in passport to use client credentials
passport.use(
  new GoogleStrategy(
    {
      // passing client id and secret from environment
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      // callback will receive the users google profile
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    // passing user profile data through done function: save to database later
    (accessToken, refreshToken, profile, done) => {
      //when done, go to profile
      return done(null, profile);
    }
  )
);

//session management, saving user data inside session:
passport.serializeUser((user, done) => done(null, user));

//retrieving user data when needed
passport.deserializeUser((user, done) => done(null, user));

// define routes
router.post("/spotify/exchange-token", authController.getSpotifyAccessToken);
router.get("/spotify/profile", authController.getSpotifyProfile);
router.get("/google/profile", authController.getGoogleProfile);
router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleCallback);
router.get("/logout", authController.logout);

module.exports = router;
