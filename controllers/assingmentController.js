const studentModel = require("../models/student/studentModel");
const { validateAssignment } = require("../midleware/validation");
const transporter = require("../mail/handlebars");
const { upload } = require("../midleware/multer");
const jwt = require("jsonwebtoken");

// Set up the storage for file uploads
exports.assignment = (req, res) => {
 
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Handle file upload error
      return res.status(400).json({ error: 'File upload failed.' });
    }

    // File upload was successful
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided.' });
    }

    // Validate form.
    const validationErrors = validateAssignment(req.body);
    const otherErrors = [];
   
    // Combine validation errors
    const combinedErrors = { ...validationErrors, ...otherErrors };

    if (Object.keys(combinedErrors).length > 0) {
      return res.render("upload", { validationErrors, otherErrors });
    } else {
      // Get the user's email
      const token = req.cookies.token;
      let email;
      try {
        const decodedToken = jwt.verify(token, "secretKey");
        email = decodedToken.email;
      } catch (error) {
        return res.status(400).send("Bad Request");
      }

      // Find the user using the email
      studentModel.findUserByEmail(email, (err, user) => {
        if (err) {
          console.error("An error occurred while searching for the user:", err);
          return res.status(500).json({ error: "An error occurred while searching for the user" });
        }

        // Table name
        const tableName = "assignments";

        // Table columns
        const columnNames = [
          "id INT AUTO_INCREMENT PRIMARY KEY",
          "name VARCHAR(255)",
          "email VARCHAR(255)",
          "module VARCHAR(255)",
          "instructions TEXT",
          "fileName VARCHAR(255)",
          "dueDate VARCHAR(255)",
        ];

        // Table values
        const values = [
          user.name,
          user.email,
          req.body.module,
          req.body.instructions,
          req.file.filename,
          req.body.dueDate,
        ];

        // Mail options
        const to = user.email;
        const subject = "Assignment summary";
        const template = "assignmentmail";
        const context = {
          name: user.name,
          module: req.body.module,
          duedate: req.body.duedate,
          price: "R250",
        };

        studentModel.createTable(tableName, columnNames, (err, tableCreated) => {
          if (err) {
            return res.status(500).json({
              error: `An error occurred while checking or creating the ${tableName} table`,
            });
          }

          // Table columns
          const columns = [
            "name",
            "email",
            "module",
            "instructions",
            "fileName",
            "dueDate",
          ];

          // After the table has been created, insert values into the table
          studentModel.insertData(tableName, columns, values, (err) => {
            if (err) {
              console.error("Error occurred while inserting data:", err);
              return res.status(500).json({ error: "An error occurred while inserting data" });
            }

            // After data has been inserted, send an email
            const mailOptions = studentModel.createMailOptions(to, subject, template, context);

            // Send email
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.status(500).json({ error: "An error occurred while sending mail" });
              } else {
               
              }
            });

            // Return success response (modify this to send back to the same file with errors or success message)
           return res.redirect("/upload?alert=" + encodeURIComponent("You successfully uploaded your assignment, our tutor will be on shortly"));

          });
        });
      });
    }
  });
};
