const db = require("../../db/dbConnection");
// Get all users
const getAllRowsFromTable = (tableName, callback) => {
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

//exports
module.exports = {
  getAllRowsFromTable
};