const jwt = require("jsonwebtoken");
const { dbConfig, connection, pool } = require("../db/db");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const { decryptPassword } = require("../middleware/password.decrypt");

// User login handler function
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    // Create a MySQL connection pool
    const pool = mysql.createPool(dbConfig);

    // Retrieve the user from the database based on email
    const query = "SELECT * FROM user_incomming WHERE email = ?";
    pool.query(query, [email], async (error, results) => {
      if (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      // Check if the user exists
      if (results.length === 0) {
        return res.status(401).json({ error: "User not found pleae signup" });
      }
      const user = results[0];
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await decryptPassword(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      // Generate a token using the user ID
      const token = jwt.sign({ org_id: user.org_id }, "javascrit"
       
      );

      // Set the token as a cookie using the 'access_token' name
      res.cookie("user_acces_token", token, {
        httpOnly: true,
        // Set to true if using HTTPS
      });
      
      res.cookie("user_email", results[0].email, {
        httpOnly: true,
        // Set to true if using HTTPS
      });

      // Return a success response
      res.status(200).json({ message: "Login successful", token,email:results[0].email});
    });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { userLogin };