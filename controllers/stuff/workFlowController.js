const workflowModel = require("../../models/stuff/workFlowModell"); 
const multer = require('multer');

// Define your controller functions
const getAssignments = (callback) => {
  workflowModel.getAllRowsFromTable('assignments', (err, assignments) => {
    if (err) {
      console.error('Error retrieving assignments:', err);
      callback([]);
    } else {
      callback(assignments);
    }
  });
};


// booking details
const getBookings = (callback) => {
  workflowModel.getAllRowsFromTable('booking', (err, bookings) => {
    if (err) {
      console.error('Error retrieving bookings:', err);
      callback([]);
    } else {
      callback(bookings);
    }
  });
};


// Create multer upload instance
const upload = multer();


// File filter function to accept only specific file types
const fileFilter = (req, file, cb) => {
  // Define the allowed mimetypes for each file type
  const allowedMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'application/zip',
    'text/plain',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  // Check if the file mimetype is in the allowed mimetypes array
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV, Excel, Word, PDF, ZIP, TXT, PowerPoint, and image files are allowed!'), false);
  }
};


const uploadAnswer = function(req, res, next) {
  // req.file is the `file` file
  // req.body will hold the text fields, if there were any
  console.log(req.body);

  // Process the file and form data as needed
  // ...

  res.status(200).json({ message: 'File uploaded successfully' });
};


//exports
module.exports = {
  getAssignments,
  getBookings,
  uploadAnswer,
    
};