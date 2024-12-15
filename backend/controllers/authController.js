//import database
const database = require("../models/database");

const passport = require("passport");

//get the spotify access token using clientid,code and verifier
const getAccessToken = async (req, res) => {
  // get params expected from the frontend
  const { clientId, code, codeVerifier } = req.body;

  // console.log("\nSession data before saving token: ", req.session);
  // // //verify paramters
  // console.log("\nIncoming request:", { clientId, code, codeVerifier });

  if (!clientId || !code || !codeVerifier) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:5173/auth/spotify/callback");
  params.append("code_verifier", codeVerifier);

  //log payload sent to spotify
  // console.log("\nParams sent to Spotify API:", params.toString());

  //fetch the spotify api token
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  //error handling
  if (!response.ok) {
    const errorDetails = await response.json();
    console.error("Spotify token exchange failed:", errorDetails);
    return res.status(response.status).json(errorDetails);
  }
  const tokenData = await response.json();

  //check for successful fetch
  if (tokenData.access_token) {
    //set the sessions access token to the one received from spotify
    req.session.accessToken = tokenData.access_token;

    //save the session so that the access token in the session can be used for fetching spotify profile
    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).json({ error: "Failed to save session" });
      }
      // console.log("\nResponse: ", res.body);
      // console.log("\nExchange token route");
      // console.log("\nSession ID:", req.sessionID);
      // console.log("\nSession saved: ", req.session);

      res.json({ success: true });
    });
  } else {
    res.status(400).json({ error: "Failed to exchange token" });
  }
};

//fetch the spotify profile using the spotify access token stored in session
const getSpotifyProfile = async (req, res) => {
  // console.log(
  //   "\nSession data before making api request to spotify for profile, look for token:",
  //   req.session
  // );
  // console.log("\nProfile Route");
  // console.log("Session ID:", req.sessionID);
  // console.log(req.session);

  // Retrieve access token from session
  const accessToken = req.session.accessToken;

  //check for an access token
  if (!accessToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No access token in session" });
  }

  //get spotify profile using access token
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  //if result didnt return an ok status, send an error response
  if (!result.ok) {
    return res.status(result.status).json({ error: "Failed to fetch profile" });
  }

  //send the spotify profile to frontend
  const profileData = await result.json();
  res.json(profileData);
};

const getGoogleProfile = (req, res) => {
  try {
    if (!req.user) {
      console.log("User is not authenticated");
      throw new Error("User is not authenticated");
    }
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in /profile/google:", error);
    console.error("Error in /profile/google:", error);
    res.status(500).json({ error: error.message });
  }
};

//authenticate through google: retreiving users profile and email, then go to callback URL
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

//callback URL, if authorization failed redirect to homepage, else go to profile URL
const googleCallback = [
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // res.redirect("/profile/google");
    //redirect to frontend
    res.redirect("http://localhost:5173/auth/google/callback");
  },
];

const logout = (req, res) => {
  // if the request is to logout, redirect to homepage
  req.logOut(() => {
    res.redirect("/");
  });
};

module.exports = {
  getAccessToken,
  getSpotifyProfile,
  googleAuth,
  googleCallback,
  getGoogleProfile,
  logout,
};
