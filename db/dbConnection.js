const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./.ev" });

// Connection to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "studentsDB",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("mysql connected...");
  }
});

module.exports = db;
