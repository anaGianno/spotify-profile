//connect database to server for postgres queries
const Pool = require("pg").Pool;
const database = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.POSTGRES_DB,
});

module.exports = database;
