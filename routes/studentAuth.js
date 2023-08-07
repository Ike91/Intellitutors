const express = require("express");
const studentModel = require("../models/student/studentModel");
const bookModel = require("../models/BookModel");
const assignmentModel = require("../models/AssignmentModel");
const workflowController = require("../controllers/stuff/workFlowController");
const router = express.Router();

// Import the authentication middleware
const authenticate = require("../midleware/authenticationMiddleware");

//assignment controller
const assignmentController = require("../controllers/assingmentController");

//book controller
const bookController = require("../controllers/bookController");

// Define your routes
router.get("/home", authenticate, (req, res) => {

  studentModel.getUserFromToken(req, (err, user) => {
    if (err) {
      console.error("An error occurred:", err);
      return res.status(500).json({ error: "An error occurred" });
    }

    //get the meetings
    bookModel.getMeeting(user.email, (err, meeting) => {
      if (err) {
        console.error("An error occurred:", err);
        return;
      }

      if (!meeting) {
        console.log("No meeting found for the provided user email");
        return;
      }
      assignmentModel.getAssignments(user.email, (err, assignment) => {
        if (err) {
          console.error("An error occurred:", err);
          return;
        }

        if (!assignment) {
          console.log("No assignment found for the provided user email");
          return;
        }
        
        res.render("student_dash", { page: "home", meeting, assignment });
      });
    });
  });
});

//get the current logged in user
router.get("/profile", authenticate, (req, res) => {
  //Get user
  studentModel.getUserFromToken(req, (err, user) => {
    if (err) {
      console.error("An error occurred:", err);
      return res.status(500).json({ error: "An error occurred" });
    }
    res.render("student_dash", { page: "profile", user });
  });
});

//get the book
router.get("/book", authenticate, (req, res) => {
  res.render("student_dash", { page: "book" });
});


//upload
router.get("/upload", authenticate, (req, res) => {
  res.render("student_dash", {
    page: "upload",
    validationErrors: {},
    otherErrors: {},
  });
});

//mail
router.get("/mail", authenticate, (req, res) => {
  res.render("student_dash", { page: "mail" });
});

//notifcattions
router.get("/notification", authenticate, (req, res) => {
  res.render("student_dash", { page: "notification" });
});


//upload the assignment to the database
router.post("/assignment", assignmentController.assignment);

//book a tutorial
router.post("/book", bookController.book);

module.exports = router;
