//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const aos = require("aos");
const ejs = require("ejs");
const path = require("path");
const dotenv = require("dotenv");
const router = express.Router();
var _ = require("lodash");

const app = express();

app.use(cookieParser());

app.use(express.static("public"));

app.set("view engine", "ejs");

// Import database connection
const db = require("./db/dbConnection");

// Import custom middlewares
const userActivityMiddleware = require("./midleware/userActivity");
const usersessionsMidleware = require("./midleware/session");
const sessionExpirationMiddleware = require("./midleware/checkSessionExpiration");

// Use the middlewares
app.use(usersessionsMidleware);
app.use(userActivityMiddleware);
app.use(sessionExpirationMiddleware);

app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views", "admin", "student", "views"),
  path.join(__dirname, "views", "admin", "stuff", "views"),
]);

//Define Routes
app.use("/", require("./routes/pages"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/studentAuth"));
app.use("/", require("./routes/adminAuth"));



app.listen(3000, function () {
  console.log("Server started on port 3000");
});
