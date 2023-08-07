const jwt = require("jsonwebtoken");
// Import the database connection
const db = require("../db/dbConnection");

//create a table.
const createTable = (tableName, columns, callback) => {
  const columnDefinitions = columns.join(",\n");
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      ${columnDefinitions}
    )`;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error(`Error creating the ${tableName} table:`, err);
      callback(err);
    } else {
      callback(null);
    }
  });
};

//insert datata updated
const insertData = (tableName, columnNames, values, callback) => {
  const placeholders = new Array(values.length).fill("?").join(", ");
  const columns = columnNames.join(", ");
  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

  db.query(query, values, (err) => {
    if (err) {
      console.error("Error inserting data into table:", err);
      callback(err);
    } else {
      callback(null);
    }
  });
};

//upload assignment
const uploadAssignment = (tableName, values, callback) => {
  const placeholders = new Array(values.length).fill("?").join(", ");
  const query = `INSERT INTO ${tableName} (student, module, instructions, dateline, filename) VALUES (${placeholders})`;

  db.query(query, values, (err) => {
    if (err) {
      console.error("Error inserting data into table:", err);
      callback(err);
    } else {
      callback(null);
    }
  });
};

//Find a user by id
const findUserById = (userId, callback) => {
  const findUserQuery = `
    SELECT * FROM users
    WHERE id = ?
  `;

  db.query(findUserQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error searching for the user:", err);
      callback(err, null);
    } else {
      if (results.length === 0) {
        // User not found
        callback(null, null);
      } else {
        // User found
        const user = results[0];
        callback(null, user);
      }
    }
  });
};

// Find user by email
const findUserByEmail = (email, callback) => {
  const findUserQuery = `
    SELECT * FROM users
    WHERE email = ?
  `;

  db.query(findUserQuery, [email], (err, results) => {
    if (err) {
      console.error("Error searching for the user:", err);
      callback(err, null);
    } else {
      if (results.length === 0) {
        // User not found
        callback(null, null);
      } else {
        // User found
        const user = results[0];
        callback(null, user);
      }
    }
  });
};

// Check if a user exists with the specified email
const checkUserExistenceByEmail = (email, callback) => {
  const findUserQuery = "SELECT 1 FROM users WHERE email = ? LIMIT 1";

  db.query(findUserQuery, [email], (err, results) => {
    if (err) {
      console.error("Error searching for the user:", err);
      return callback(err, null);
    }

    const userExists = results.length > 0;
    callback(null, userExists);
  });
};

//extract email from a token
const extractEmailFromToken = (token, secretKey) => {
  try {
    const decodedToken = jwt.verify(token, secretKey);
    return decodedToken.email;
  } catch (err) {
    return null;
  }
};

//exports
module.exports = {
  createTable,
  insertData,
  findUserById,
  findUserByEmail,
  uploadAssignment,
  extractEmailFromToken,
  checkUserExistenceByEmail,
};
