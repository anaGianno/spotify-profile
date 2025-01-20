// load environment variables
require("dotenv").config();

// initialize server
const express = require("express");
const app = express();

// server middleware setup: allow server/client to communicate with eachother
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET, POST, DELETE",
    credentials: true,
  })
);
// give server access to get json data from request body
app.use(express.json());

// session middleware for authentication
const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

//initialize passportjs for authentication
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

//import all routes
const albumRoute = require("./routes/album");
const artistRoute = require("./routes/artist");
const authRoute = require("./routes/auth");
const spotifyRoute = require("./routes/spotify");
const trackRoute = require("./routes/track");
const userRoute = require("./routes/user");

// set path for each route
app.use("/album", albumRoute);
app.use("/artist", artistRoute);
app.use("/auth", authRoute);
app.use("/spotify", spotifyRoute);
app.use("/track", trackRoute);
app.use("/user", userRoute);

//server listen on a port: read port environment value otherwise use port 3000
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}...`)
);
