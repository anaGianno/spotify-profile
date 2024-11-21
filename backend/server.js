require("dotenv").config();

//import database
const database = require("./database");
//import cors to allow server/client to communicate with eachother
const cors = require("cors");
//import Joi for input validation
const Joi = require("joi");
//import expressjs
const express = require("express");
const app = express();

// const dotenv = require('dotenv');
// dotenv.config();
// const {OAuth2Client} = require('google-auth-library');

// var authRouter = require('./backend/oauth.js');
// var requestRouter = require('./backend/request');
// var htmlAuthRouter = require('./backend/htmlAuth');
// app.use('/oauth',authRouter);
// app.use('/request',requestRouter);
// app.use('/htmlAuth',htmlAuthRouter);

const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/", (req, res) => {
  res.send("<a href= '/auth/google/'>Login with Google</a>");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

app.get("/profile", (req, res) => {
  res.send(`Welcome ${req.user.displayName}`);
});

app.get("/logout", (req, res) => {
  req.logOut(() => {
    res.redirect("/");
  });
});

//allow server/client to communicate with eachother
app.use(cors());
//give access to request body to get json data
app.use(express.json());

//read port environment value otherwise use port 3000
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}...`)
);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.post("/users", async (req, res) => {
  try {
    //check for username
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //get username
    const { user_name } = req.body;
    const newUser = await database.query();
  } catch (err) {
    //pass the error to middleware
    next(error);
  }
});

// app.post("/", async (req, res) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Referrer-Policy", "no-referrer-when-downgrade");

//   const redirectURL = "http://127.0.0.1:3000/oauth";
//   const oAuth2Client = new OAuth2Client(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     redirectURL
//   );

//   const authorizeUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: "https://www.googleapis.com/auth/userinfo.profile openid",
//     prompt: "consent",
//   });

//   res.json({ url: authorizeUrl });
// });

// //ensure a username has been entered
// function validateUser(user) {
//   const schema = Joi.object({
//     user_name: Joi.string().min(3).required(),
//   });

//   return schema.validate(request);
// }
