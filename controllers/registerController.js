const { validateRegistration } = require("../midleware/validation");
const studentModel = require("../models/student/studentModel");
const transporter = require("../mail/handlebars");
const bcrypt = require("bcryptjs");

exports.register = (req, res) => {
  let otherErrors = [];
  const validationErrors = validateRegistration(req.body);
  const combinedErrors = { ...validationErrors, ...otherErrors };

  //
  if (req.body.myCheckbox !== "isChecked") {
    otherErrors.push("You must accept the terms and conditions to continue");
  }

  const tableName = "users";
  const columns = [
    "id INT AUTO_INCREMENT PRIMARY KEY",
    "name VARCHAR(255)",
    "email VARCHAR(255)",
    "phoneNumber INT",
    "studentType VARCHAR(255)",
    "password VARCHAR(255)",
    "verified BOOLEAN DEFAULT FALSE",
  ];

  // Function to hash the password
  const hashPassword = async (password, callback) => {
    try {
      const saltRounds = 8;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      callback(hashedPassword); // Pass the hashed password to the callback function
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      throw new Error("Error hashing password");
    }
  };

  // Example usage
  const password = req.body.password;
  const id = 1;
  hashPassword(password, (hashedPassword) => {
    // Print the hashed password
    const data = [
      req.body.name,
      req.body.email,
      req.body.phoneNumber,
      req.body.studentType,
      hashedPassword,
      false,
    ];

    studentModel.createTable(tableName, columns, (err, result) => {
      if (err) {
        console.error("Error creating table:", err);
      } else {
        const columnNames = [
          "name",
          "email",
          "phoneNumber",
          "studentType",
          "password",
          "verified",
        ];

        // Check if the user already exist
        studentModel.findUserByEmail(req.body.email, (err, user) => {
          if (err) {
            console.error(
              "An error occurred while searching for the user:",
              err
            );
            return res.status(500).json({
              error: "An error occurred while searching for the user",
            });
          }

          // The user does exist
          if (user) {
            const otherErrors = ["That email is already taken"];
            return res.render("signup", {
              validationErrors,
              otherErrors,
            });
          }

          //insert the data
          studentModel.insertData(
            tableName,
            columnNames,
            data,
            (err, result) => {
              if (err) {
                console.error("Error inserting data:", err);
              } else {
                //confrimation url:
                const confirmationUrl = "https://chat.openai.com/";

                const to = req.body.email;
                const subject = "confirm email";
                const template = "confirmmail";
                const context = {
                  name: req.body.name,
                  confirmationUrl: confirmationUrl,
                };
                const mailOptions = studentModel.createMailOptions(
                  to,
                  subject,
                  template,
                  context
                );

                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    return res
                      .status(500)
                      .json({ error: "An error sending email" });
                  } else {
                    console.log();
                  }
                });

                return res.render("success");
              }
            }
          );
        });
      }
    });
  });
};
