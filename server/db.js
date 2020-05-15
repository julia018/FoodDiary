const {Pool} = require("pg");
const {dbUser, dbHost, dbDatabase, dbPassword, dbPort} = process.env;

const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbDatabase,
  password: dbPassword,
  port: dbPort
});

if (!pool) {
  console.log("DB problems");
} else {
  console.log("DB ok");
}

module.exports = pool;