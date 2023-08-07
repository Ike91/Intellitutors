const multer = require("multer");
const path = require("path");

// Set up the storage destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads"); // Specify the destination directory for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename for each uploaded file
  },
});

// Create the multer instance with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
