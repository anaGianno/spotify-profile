//connect database to server for postgres queries
const Pool = require("pg").Pool;
const database = new Pool({
    user: "postgres",
    password: "P1tter!a",
    host: "localhost",
    port:5432,
    database: "spotifyprofile"
})

module.exports = database;