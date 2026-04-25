const db = require('../db/db');

// Check if user exists
const findUserByEmailOrUsername = (username, email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE username = ? OR email = ?`;

    db.query(query, [username, email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // return first match
    });
  });
};

// Create new user
const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      query,
      [userData.username, userData.email, userData.password, userData.role],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

module.exports = {
  findUserByEmailOrUsername,
  createUser
};