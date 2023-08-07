const jwt = require("jsonwebtoken");
const db = require("../../db/dbConnection");

const createTable = (tableName, columns, callback) => {
  const columnDefinitions = columns.join(",\n");
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      ${columnDefinitions}
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error(`Error creating the ${tableName} table:`, err);
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

//insert data
const insertData = (tableName, columnNames, values, callback) => {
  const placeholders = new Array(values.length).fill("?").join(", ");
  const columns = columnNames.map((column) => `\`${column}\``).join(", ");
  const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into table:", err);
      callback(err);
    } else {
      callback(null, result);
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
        // User not foun
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
const UserExistenceByEmail = (email, callback) => {
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



  //find user by id.
  const findUserById = (id, callback) => {
  const findUserQuery = "SELECT 1 FROM assignments WHERE id = ? LIMIT 1";

  db.query(findUserQuery, [id], (err, results) => {
    if (err) {
      console.error("Error searching for the user:", err);
      return callback(err, null);
    }

    const userExists = results.length > 0;
    callback(null, userExists);
  });
};

//extract email from a token
const extractEmail = (token, secretKey) => {
  try {
    const decodedToken = jwt.verify(token, secretKey);
    return decodedToken.email;
  } catch (err) {
    return null;
  }
};

//return a user for me
const getUserFromToken = (req, callback) => {
  const token = req.cookies.token;
  if (!token) {
    return callback(new Error("No token found"));
  }

  let email;
  try {
    const decodedToken = jwt.verify(token, "secretKey");
    email = decodedToken.email;
  } catch (error) {
    return callback(new Error("Invalid token"));
  }

  findUserByEmail(email, (err, user) => {
    if (err) {
      console.error("An error occurred while searching for the user:", err);
      return callback(err);
    }

    callback(null, user);
  });
};



//mail option
const createMailOptions = (to, subject, template, context) => {
  return {
    from: "isaac.mhlanga13@gmail.com",
    to: to,
    subject: subject,
    template: template,
    context: context,
  };
};

//exports
module.exports = {
  createTable,
  insertData,
  findUserByEmail,
  extractEmail,
  UserExistenceByEmail,
  getUserFromToken,
  createMailOptions,
  findUserById,
};
