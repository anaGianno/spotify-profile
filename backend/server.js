//load environment variables
require("dotenv").config();

//import database
const database = require("./database");
//import cors to allow server/client to communicate with eachother
const cors = require("cors");
//import Joi for input validation
const Joi = require("joi");
//import expressjs: create server
const express = require("express");
//initialize server
const app = express();

//read port environment value otherwise use port 3000
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}...`)
);

//passportjs for authentication
const passport = require("passport");
//session management
const session = require("express-session");
//google oauth2
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//middleware, secret key to encrypt sessions
app.use(
  session({
    secret: "secret",
    //avoid resaving sessions if nothing has changed
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // Use false for development only
      sameSite: "Lax", // Fallback to Lax for local testing
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

//initializes passport
app.use(passport.initialize());
//make sure passport integrates with express session
app.use(passport.session());

//allow server/client to communicate with eachother
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET, POST",
    credentials: true, // Allow cookies to be sent
  })
);

//give access to request body to get json data
app.use(express.json());

//get the spotify access token using clientid,code and verifier
app.post("/auth/spotify/exchange-token", async (req, res) => {
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
});

//fetch the spotify profile using the spotify access token stored in session
app.get("/auth/spotify/profile", async (req, res) => {
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
});

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

//authenticate through google: retreiving users profile and email, then go to callback URL
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//callback URL, if authorization failed redirect to homepage, else go to profile URL
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // res.redirect("/profile/google");
    //redirect to frontend
    res.redirect("http://localhost:5173/auth/google/callback");
  }
);

app.get("/profile/google", (req, res) => {
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
});

//on successful google auth display user name
app.get("/profile/spotify", (req, res) => {
  // res.send(`Welcome ${req.user.displayName}`);
  res.send("Body: ", req.body);
});

app.get("/logout", (req, res) => {
  // if the request is to logout, redirect to homepage
  req.logOut(() => {
    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  res.send("Server is ready");
});

//user routes
app.get("/users", async (req, res) => {
  try {
    const allUsers = await database.query("SELECT * FROM user_");
    res.send(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/users/:email", async (req, res) => {
  try {
    const user = await database.query(
      "SELECT * FROM user_ WHERE email = $1 AND (type_ = 'spotify' OR type_ ='spotify-google')",
      [req.params.email]
    );

    console.log("user: ", user);
    // Check if any rows are returned
    if (user.rows.length == 0) {
      return res.status(404).json({
        error: `The user with the email: ${req.params.email} was not found/linked with spotify.`,
      });
      // return res.send("No spotify user with this email");
    }

    res.send(user.rows);
  } catch (err) {
    // //pass the error to middleware
    // next(error);
    console.error("Console Error: " + err.message);
  }
});

app.post("/users", async (req, res) => {
  try {
    //check for username
    // const { error } = validateUser(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    // if (error) return res.status(400).send(error);
    //get username
    const { user_id, user_name, type_, email, image_url } = req.body;
    const user = await database.query(
      "SELECT * FROM user_ WHERE user_id = $1",
      [user_id]
    );

    console.log("user: ", user);
    // Check if any rows are returned
    if (user.rows.length > 0) {
      if (type_ === "spotify" || type_ === "google") {
        return res
          .status(403)
          .send("The user with the given ID was already found");
      }
    }

    const newUser = await database.query(
      "INSERT INTO user_ (user_id, user_name, type_, email, image_url) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [user_id, user_name, type_, email, image_url]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    // //pass the error to middleware
    // next(error);
    console.error("Console Error: " + err.message);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await database.query(
      "SELECT * FROM user_ WHERE user_id = $1",
      [req.params.id]
    );
    if (user.rows[0] == undefined)
      return res.status(404).send("The user with the given ID was not found");
    const updateUser = await database.query(
      "DELETE FROM user_ WHERE user_id = $1",
      [req.params.id]
    );
    res.send(`User with ID: ${req.params.id} was deleted`);
  } catch (err) {
    console.error("Console Error: " + err.message);
  }
});

//track routes
app.get("/tracks", async (req, res) => {
  try {
    const allTracks = await database.query("SELECT * FROM track");
    res.send(allTracks.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/tracks", async (req, res) => {
  try {
    const { track_id, track_name, artist_name, image_url, track_user_id } =
      req.body;
    var { duration } = req.body;
    duration = millisToMinutesAndSeconds(duration);
    const newTrack = await database.query(
      "INSERT INTO track (track_id,track_name,artist_name,duration,image_url,track_user_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [track_id, track_name, artist_name, duration, image_url, track_user_id]
    );
    res.json(newTrack.rows[0]);
  } catch (err) {
    // //pass the error to middleware
    // next(error);
    console.error("Console Error: " + err.message);
  }
});

app.delete("/tracks/:id", async (req, res) => {
  try {
    const track = await database.query(
      "SELECT * FROM track WHERE track_id = $1",
      [req.params.id]
    );
    if (track.rows[0] == undefined)
      return res.status(404).send("The track with the given ID was not found");
    const updateUser = await database.query(
      "DELETE FROM track WHERE track_id = $1",
      [req.params.id]
    );
    res.send(`Track with ID: ${req.params.id} was deleted`);
  } catch (err) {
    console.error("Console Error: " + err.message);
  }
});

//artist routes
app.get("/artists", async (req, res) => {
  try {
    const allArtists = await database.query("SELECT * FROM artist");
    res.send(allArtists.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/artists", async (req, res) => {
  try {
    const { artist_id, artist_name, image_url, artist_user_id } = req.body;
    const newArtist = await database.query(
      "INSERT INTO artist (artist_id,artist_name,image_url,artist_user_id) VALUES($1,$2,$3,$4) RETURNING *",
      [artist_id, artist_name, image_url, artist_user_id]
    );
    res.json(newArtist.rows[0]);
  } catch (err) {
    // //pass the error to middleware
    // next(error);
    console.error("Console Error: " + err.message);
  }
});

app.delete("/artists/:id", async (req, res) => {
  try {
    const artist = await database.query(
      "SELECT * FROM artist WHERE artist_id = $1",
      [req.params.id]
    );
    if (artist.rows[0] == undefined)
      return res.status(404).send("The artist with the given ID was not found");
    const updateArtist = await database.query(
      "DELETE FROM artist WHERE artist_id = $1",
      [req.params.id]
    );
    res.send(`Artist with ID: ${req.params.id} was deleted`);
  } catch (err) {
    console.error("Console Error: " + err.message);
  }
});

//album routes
app.get("/albums", async (req, res) => {
  try {
    const allAlbums = await database.query("SELECT * FROM album");
    res.send(allAlbums.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/albums", async (req, res) => {
  try {
    const {
      album_id,
      album_name,
      album_release_date,
      total_tracks,
      image_url,
      artist_name,
      album_user_id,
    } = req.body;
    const newAlbum = await database.query(
      "INSERT INTO album (album_id,album_name,album_release_date,total_tracks,image_url,artist_name,album_user_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        album_id,
        album_name,
        album_release_date,
        total_tracks,
        image_url,
        artist_name,
        album_user_id,
      ]
    );
    res.json(newAlbum.rows[0]);
  } catch (err) {
    // //pass the error to middleware
    // next(error);
    console.error("Console Error: " + err.message);
  }
});

app.delete("/albums/:id", async (req, res) => {
  try {
    const album = await database.query(
      "SELECT * FROM album WHERE album_id = $1",
      [req.params.id]
    );
    if (album.rows[0] == undefined)
      return res.status(404).send("The album with the given ID was not found");
    const updateAlbum = await database.query(
      "DELETE FROM album WHERE album_id = $1",
      [req.params.id]
    );
    res.send(`Album with ID: ${req.params.id} was deleted`);
  } catch (err) {
    console.error("Console Error: " + err.message);
  }
});
// //ensure a username has been entered
// function validateUser(user) {
//   const schema = Joi.object({
//     // email: Joi.string().required(),
//     allowUnknown: true,
//   });

//   return schema.validate(user);
// }

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
