const { LoginValidation } = require("../midleware/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentModel = require("../models/student/studentModel");

exports.login = (req, res) => {
  //define other errors
  let otherErrors = [];
  //validate form.
  const validationErrors = LoginValidation(req.body);
  const combinedErrors = { ...LoginValidation(req.body), ...otherErrors };
  //check if userExist/
  studentModel.findUserByEmail(req.body.email, (err, user) => {
    if (err) {
      console.error("An error occurred while searching for the user:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while searching for the user" });
    } else {
      //check if a user exists
      if (!user) {
        otherErrors.push("User not found");
        if (Object.keys(combinedErrors).length > 0) {
          return res.render("login", { validationErrors, otherErrors });
        }
      }

      //check if the user is verified
      if (!user.verified) {
        otherErrors.push(
          "Your email is not verified, plase chsck your inbox or span folder and verify your email"
        );
        return res.render("login", { validationErrors, otherErrors });
      }

      //else compare the email
      bcrypt.compare(req.body.password, user.password, (error, isMatch) => {
        if (error) {
          console.error("Error comparing passwords:", error);
          return res
            .status(500)
            .json({ error: "An error occurred while comparing passwords" });
        }

        if (!isMatch) {
          otherErrors.push("Invalid email or password");
          if (Object.keys(combinedErrors).length > 0) {
            return res.redirect("login", { validationErrors, otherErrors });
          }
        } else {
          const token = jwt.sign(
            { userId: user.id, email: user.email },
            "secretKey"
          );

          req.session.token = token;
          res.cookie("token", token, { httpOnly: true });

          //redirect the user acoourding to the student type
          if (user.studentType === "Admin") {
             //redirect to admin dashboard
          return res.redirect("/dashboard");
          } else {
            //redirect to student dashboard
          return res.redirect("/home");

          }
        }
      });
    }
  });
};
