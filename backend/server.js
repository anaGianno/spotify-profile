//import database
const database = require("./database");
//import cors to allow server/client to communicate with eachother
const cors = require("cors");
//import Joi for input validation
const Joi = require('joi');
//import expressjs
const express = require("express");
const app = express();

//allow server/client to communicate with eachother
app.use(cors());
//give access to request body to get json data
app.use(express.json());

//read port environment value otherwise use port 5000
const port = process.env.PORT || 5000;
app.listen(port,() => console.log(`Server started at http://localhost:${port}...`));

app.get('/',(req,res) => {
    res.send('Server is ready');
});