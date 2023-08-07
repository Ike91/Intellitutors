const db = require("../../db/dbConnection");

const tableName = "users"
// Get all users
const getAllUsers = (tableName, callback) => {
  const getAllRowsQuery = `
    SELECT * FROM ${tableName}
  `;

  db.query(getAllRowsQuery, (err, results) => {
    if (err) {
      console.error(`Error retrieving rows from ${tableName}:`, err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

//take all users and put them in ana array
const getUsersArray = (callback) => {
  const tableName = 'users';

  getAllUsers(tableName, (err, results) => {
    if (err) {
      console.error('Error retrieving users:', err);
      callback(err, null);
    } else {
      // Convert the results into an array
      const usersArray = results.map((row) => row);
        callback(null, usersArray);
    }
  });
};

//exports
module.exports = {
  getUsersArray
};