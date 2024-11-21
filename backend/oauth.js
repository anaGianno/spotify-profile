// //import database
// const database = require("./database");
// //import cors to allow server/client to communicate with eachother
// const cors = require("cors");
// //import Joi for input validation
// const Joi = require('joi');
// //import expressjs
// const express = require("express");
// const app = express();

// const dotenv = require('dotenv');
// dotenv.config();
// const {OAuth2Client} = require('google-auth-library');

// async function getUserData(access_token){
//     const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`);
//     const data = await response.json();
//     console.log('data',data);
// }

// app.get('/',async(req,res) => {
//     const code = req.query.code;
//     console.log('code',code);
//     try{
//         const redirectUrl = 'http://127.0.0.1:3000/oauth'
//         const oAuth2Client = new OAuth2Client(
//             process.env.CLIENT_ID,
//             process.env.CLIENT_SECRET,
//             redirectURL
//           );
//           const res = await oAuth2Client.getToken(code);
//           await oAuth2Client.setCredentials(res.tokens);
//           console.log('Tokens acquired');
//           const user = oAuth2Client.credentials;
//           console.log('credentials',user);
//           await getUserData(user.access_token);

//     }catch(err){
//         console.log('Error with signing in with Google');
//     }
//   });