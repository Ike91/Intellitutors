const jwt = require("jsonwebtoken");
const db = require("../db/dbConnection");
const studentModel = require("../models/studentModel");

//get all the assignments
const getAssignments = (useremail, callback) => {
  studentModel.findUserByEmail(useremail, (err, user) => {
    if (err) {
      console.error("An error occurred while searching for the user:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while searching for the user" });
    }

    const email = user.email;
    const findUserQuery = `SELECT * FROM assignments WHERE email = ?`;
    db.query(findUserQuery, [email], (err, results) => {
      if (err) {
        console.error("Error searching for the user:", err);
        callback(err, null);
      } else {
        if (results.length === 0) {
          // User not foun
          callback(null, []);
        } else {
          // User found
          callback(null, results);
         
        }
      }
    });
  });
};

//exports
module.exports = {
  getAssignments,
};
