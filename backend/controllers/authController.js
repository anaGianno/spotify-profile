const passport = require("passport");

// get spotify access token
const getSpotifyAccessToken = async (req, res) => {
  try {
    // get params from request
    const { clientId, code, codeVerifier } = req.body;

    // return error if parameters are missing
    if (!clientId || !code || !codeVerifier) {
      return res
        .status(400)
        .send("Error: missing parameters from getSpotifyAccessToken request");
    }

    // create parameters to send
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append(
      "redirect_uri",
      "http://localhost:5173/auth/spotify/callback"
    );
    params.append("code_verifier", codeVerifier);

    // fetch spotify api token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      }
    );

    // return error if fetch to spotify failed
    if (!tokenResponse.ok) {
      const errorDetails = await tokenResponse.json();
      console.error("Error with Spotify token exchange: ", errorDetails);
      return res.status(tokenResponse.status).json(errorDetails);
    }

    const tokenData = await tokenResponse.json();

    // check for successful fetch
    if (tokenData.access_token) {
      // set access token to session
      req.session.accessToken = tokenData.access_token;

      // save session
      req.session.save((err) => {
        // display error if save failed
        if (err) {
          return res.status(500).send("Error saving session");
        }

        res.status(200).send("Successfully saved session");
      });
    } else {
      res.status(400).send("Error: no token in token response");
    }
  } catch (err) {
    res.status(500).send("Error getting access token: " + err.message);
  }
};

// fetch spotify profile
const getSpotifyProfile = async (req, res) => {
  try {
    // get access token from session
    const accessToken = req.session.accessToken;

    // return error if access token not found
    if (!accessToken) {
      return res.status(401).send("Error: access token not found in session");
    }

    // fetch spotify profile
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // // log spotify profile response
    // console.log("Spotify profile response:", profileResponse);

    // return error if response unsuccessful
    if (!profileResponse.ok) {
      return res
        .status(profileResponse.status)
        .send("Error: failed to fetch spotify profile");
    }

    const profileData = await profileResponse.json();
    res.json(profileData);
  } catch (err) {
    res.status(500).send("Error fetching spotify profile");
    return res
      .status(500)
      .send("Error fetching spotify profile: " + err.message);
  }
};

// get google profile
const getGoogleProfile = (req, res) => {
  try {
    // return error if no user found in session
    if (!req.user) {
      return res.status(401).send("Error: google user not found");
    }

    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).send("Error sending Google proifle: " + err.message);
    return res.status(500).send("Error sending Google profile: " + err.message);
  }
};

// authenticate through google then go to callback URL
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// redirect to frontend on successful authentication
const googleCallback = [
  // go to homepage on failed authentication
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173/auth/google/callback");
  },
];

// redirect to homepage
const logout = (req, res) => {
  req.logOut(() => {
    res.redirect("/");
  });
};

// export methods
module.exports = {
  getSpotifyAccessToken,
  getSpotifyProfile,
  googleAuth,
  googleCallback,
  getGoogleProfile,
  logout,
};
