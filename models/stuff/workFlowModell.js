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

//find a user row by email and update two columns,
const updateUser = (id, status, price) => {
  const selectQuery = 'SELECT * FROM assignments WHERE id = ?';

  db.query(selectQuery, [id], (error, results) => {
    if (error) {
      return;
    }

    // Proceed with the update
    const updateQuery = 'UPDATE assignments SET status = ?, price = ? WHERE id = ?';

    db.query(updateQuery, [status, price, id], (error, results) => {
      if (error) {
        return;
      }
    });
  });
};



//exports
module.exports = {
  getAllRowsFromTable,
  updateUser,
};