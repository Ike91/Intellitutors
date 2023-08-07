const studentModel = require("../models/studentModel");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const token = req.cookies.token;
      let email;
      try {
        const decodedToken = jwt.verify(token, "secretKey");
        email = decodedToken.email;

        // Call the findUserByEmail function
        studentModel.findUserByEmail(email, (err, user) => {
          if (err) {
            console.error(
              "An error occurred while searching for the user:",
              err
            );
            return cb(err);
          }

          const username = user.name;
          const folderPath = `uploads/${username}`;

          // Create the folder if it doesn't exist
          fs.mkdirSync(folderPath, { recursive: true });

          cb(null, folderPath);
        });
      } catch (error) {
        console.error("Error extracting email from token:", error);
        cb(error);
      }
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  fileFilter: function (req, file, cb) {
    // Filter the files based on the allowed file types
    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Invalid file format.")); // Reject the file
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = {
  upload,
};
