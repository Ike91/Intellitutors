const express = require("express");

const router = express.Router();

//home page
router.get("/", function (req, res) {
  res.render("home");
});

//about page
router.get("/about", function (req, res) {
  res.render("about");
});

//pricing page
router.get("/pricing", function (req, res) {
  res.render("pricing");
});

//contact page
router.get("/contact", function (req, res) {
  res.render("contact");
});

//sign up routes
router.get("/signup", function (req, res) {
  res.render("signup", { validationErrors: {}, otherErrors: {} });
});

//login route
router.get("/login", function (req, res) {
  res.render("login", { validationErrors: {}, otherErrors: {} });
});

//pricing page
router.get("/mail", function (req, res) {
  res.render("mail");
});

//success page page
router.get("/success", function (req, res) {
  res.render("success");
});

module.exports = router;
