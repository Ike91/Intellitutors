const workflowModel = require("../../models/stuff/workFlowModell"); 

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


//exports
module.exports = {
    getAssignments,
    getBookings
};