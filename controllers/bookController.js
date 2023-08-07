const { BookValidation } = require("../midleware/validation");
const transporter = require("../mail/handlebars");
const studentModel = require("../models/student/studentModel");
const jwt = require("jsonwebtoken");

exports.book = (req, res) => {
  //validate form.
  const validationErrors = BookValidation(req.body);
  //define other erriors
  let otherErrors = [];

  //combine all the errors
  const combinedErrors = { ...validationErrors, ...otherErrors };

  //get the user's email
  const token = req.cookies.token;
  let email;

  try {
    const decodedToken = jwt.verify(token, "secretKey");
    email = decodedToken.email;
  } catch (error) {
    console.error("Error extracting email from token:", error);
    return res.status(400).send("Bad Request");
  }

  //find the user by email
  studentModel.findUserByEmail(email, (err, user) => {
    if (err) {
      console.error("An error occurred while searching for the user:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while searching for the user" });
    }

    //tabkle name,
    const tableName = "booking";
    // table collomns
    const columnNames = [
      "id INT AUTO_INCREMENT PRIMARY KEY",
      "name VARCHAR(255)",
      "email VARCHAR(255)",
      "phoneNumber INT",
      "Module VARCHAR(255)",
      "studentType VARCHAR(255)",
      "bookingType VARCHAR(255)",
      "date DATE",
      "time TIME",
      "venue VARCHAR(255)",
      "hours INT",
    ];

    //table values
    const values = [
      user.name,
      user.email,
      user.phoneNumber,
      req.body.module,
      user.studentType,
      req.body.bookingType,
      req.body.date,
      req.body.time,
      req.body.venue,
      req.body.hours,
    ];

    //if data has been inserted successfully, send an email
    const to = user.email;
    const subject = "Booking summary";
    const template = "bookmail";
    const context = {
      name: user.name,
      module: req.body.module,
      bookingType: req.body.bookingType,
      date: req.body.date,
      time: req.body.time,
    };

    //create atable
    studentModel.createTable(tableName, columnNames, (error, tableCreated) => {
      if (error) {
        res.status(500).json({
          error: `An error occurred while checking or creating the ${tableName} table`,
        });
      }

      //columns
      const columnNames = [
      "name",
      "email",
      "phoneNumber",
      "Module",
      "studentType",
      "bookingType",
      "date",
      "time",
      "venue",
      "hours",
    ];
      //after the table has been created(insert the values)
      studentModel.insertData(tableName, columnNames, values, (err) => {
        if (err) {
          res
            .status(500)
            .json({ error: "An error occurred while inserting data" });
        }

        //create the mail options
        const mailOptions = studentModel.createMailOptions(
          to,
          subject,
          template,
          context
        );

        //send email
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.status(500).json({ error: "An error sending meil" });
          } else {
            console.log();
          }
        });

        // Return success response
         return res.redirect("/book?alert=" + encodeURIComponent("Booking submitted successfully"));
      });
    });
  });
};
