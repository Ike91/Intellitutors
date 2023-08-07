const express = require("express");
const renderChart = require("../midleware/graph");
const workFlowController = require("../controllers/stuff/workFlowController");
const workFlowModel = require("../models/stuff/workFlowModell");
const usersModel = require("../models/stuff/usersModel");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const db = require("../db/dbConnection");

const findUserById = (id, callback) => {
  const findUserQuery = "SELECT * FROM assignments WHERE id = ? LIMIT 1";

  db.query(findUserQuery, [id], (err, results) => {
    if (err) {
      console.error("Error searching for the user:", err);
      return callback(err, null);
    }

    const user = results.length > 0 ? results[0] : null;
    callback(null, user);
  });
};

router.get("/dashboard", function (req, res) {
  res.render("dashboard", { page: "home" });
});

router.get("/settings", function (req, res) {
  res.render("dashboard", { page: "settings" });
});

router.get("/statistics", function (req, res) {
  // Retrieve data and render the dashboard
  const retrieveData = () => {
    workFlowController.getAssignments((assignments) => {
      workFlowController.getBookings((bookings) => {
        res.render("dashboard", { page: "statistics", assignments, bookings });
      });
    });
  };
  // Call the retrieveData function
  retrieveData();
});

//workflow
router.get("/workflow", (req, res) => {
  // Retrieve data and render the dashboard
  const alertMessage = req.query.alert;
  const retrieveData = () => {
    workFlowController.getAssignments((assignments) => {
      workFlowController.getBookings((bookings) => {
        res.render("dashboard", {
          page: "workflow",
          assignments,
          bookings,
          alertMessage,
        });
      });
    });
  };
  // Call the retrieveData function
  retrieveData();
});

router.get("/calendar", (req, res) => {
  res.render("dashboard", { page: "calendar" });
});

router.get("/notifications", (req, res) => {
  res.render("dashboard", { page: "notifications" });
});

//email
router.get("/email", (req, res) => {
  res.render("dashboard", { page: "email" });
});

//users
router.get("/users", (req, res) => {
  usersModel.getUsersArray((err, users) => {
    if (err) {
      console.error("Error retrieving users:", err);
    } else {
      res.render("dashboard", { page: "users", users });
    }
  });
});

//study
router.get("/study", (req, res) => {
  res.render("study");
});

//mail
router.get("/mail", (req, res) => {
  res.render("student_dash", { page: "mail" });
});

//notifications
router.get("/notification", (req, res) => {
  res.render("student_dash", { page: "notification" });
});

// router.post("/accept", workFlowController.accept);

//update something here
// router.post("/accept", (req, res) => {
//   const status = 1;
//   const price = 300;

//   workFlowModel.updateUser(req.body.id, status, price, (error) => {
//     if (error) {
//       // Handle the error appropriately
//       console.error("Error updating user:", error);
//       return res.redirect("/workflow");
//     }

//     // Redirect the user back to the /workflow route to refresh the page

//   });
//    return res.redirect(303, "/workflow");
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    findUserById(req.body.id, (err, user) => {
      if (err) {
        console.error("Error finding user by ID:", err);
        return cb(err);
      }

      if (user) {
        console.log("User found:", user);

        const path = `uploads/${user.name}/answers`;

        // Create the destination directory if it does not exist
        fs.mkdir(path, { recursive: true }, (err) => {
          if (err) {
            console.error("Error creating destination directory:", err);
            return cb(err);
          }
          cb(null, path);
        });
      } else {
        console.log("User not found!");
        cb(new Error("User not found!"));
      }
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/uploadAnswer", upload.single("file"), (req, res) => {
  // Access the uploaded file using req.file

  return res.redirect(
    "/workflow?alert=" + encodeURIComponent("answer uploaded successfully")
  );
});

module.exports = router;
