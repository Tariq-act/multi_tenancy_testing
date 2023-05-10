const { dbConfig, connection, pool } = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const mysql = require("mysql");

const cookieParser = require("cookie-parser");
const { encryptPassword } = require("../middleware/password.encrypt");
// Register handeler function;

const saltRounds = 10;

const handelUserRegister = async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;
    const time_stamp = Date.now(); // Get current timestamp
    const random_no = Math.random().toString(36).substring(2, 8);
    // creating a random database name for client;
    const tenant_uuid = `${time_stamp}_${random_no}`;
    let hashedPassword=await encryptPassword(password)
    const q =
      "INSERT INTO registration (`email`, `password`,`tenant_uuid`) VALUES (?, ?, ?)";
    const values = [email, hashedPassword, tenant_uuid];

    pool.query(q, values, async (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ error: `Cannot process request: ${err}` });
      } else {
        // creating a database;
        const createDbQ = `CREATE DATABASE tenant_${tenant_uuid}`;

        pool.query(createDbQ, async (err, resul) => {
          if (err) {
            return res
              .status(500)
              .send({ error: `Cannot process request: ${err}` });
          } else {
            const userDbConfig = {
              ...dbConfig,
              database: `tenant_${tenant_uuid}`,
            };
            const pool1 = mysql.createPool(userDbConfig);

            pool1.getConnection(async (error, connection) => {
              if (error) {
                console.log(error);
                return res
                  .status(300)
                  .send({ error: `Cannot process request: ${error}` });
              } else {
                // Call the function to check and create tables
                let todo = await createTodoTableIfNotExists(pool1);
                let user = await createUserTableIfNotExists(pool1);

                // Hash the password
                bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                  if (err) {
                    console.error("Error hashing password:", err);
                    return res
                      .status(500)
                      .send({ error: "Error hashing password" });
                  }

                  const q =
                    "INSERT INTO user (`email`,`firstname`,`lastname`,`password`,`tenant_uuid`) VALUES (?, ?, ?, ?, ?)";
                  const values = [
                    email,
                    firstname,
                    lastname,
                    hashedPassword,
                    tenant_uuid,
                  ];

                  pool1.query(q, values, (err, result) => {
                    if (result) {
                      res.status(200).send({
                        result: `Inserted data into tenant_${tenant_uuid} successfully`,
                      });
                    } else {
                      res.status(500).send({
                        result: `Error while inserting data into db tenant_${tenant_uuid}`,
                        err,
                      });
                    }
                  });
                });
              }

              connection.release();
              // Release the connection
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Cannot process request", error });
  }
};

// Login handler function

const handelUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate user and retrieve user's database information
    const isEmailPresentQ = "SELECT * FROM registration WHERE email=?";
    const value = [email];
    pool.query(isEmailPresentQ, value, (err, result) => {
      if (err) {
        return res.status(500).send({ error: "cannot process req", err });
      } else if (result.length === 0) {
        return res.status(401).send({ error: "please sign up first" });
      } else {
        // Perform password verification here
        // ...
        bcrypt.compare(password, result[0].password, (err, resul) => {
          if (err) {
            return res.status(500).json({ error: "Login again.", err });
          } else {
            // Generate a JWT token
            let uuid = result[0].tenant_uuid;
            const token = jwt.sign({ uuid }, "javascrit", {
              expiresIn: "1h",
            });
            return res
              .cookie("access_token", token, {
                httpOnly: true,
              })
              .status(200)
              .send({ token });
            // Return the token in the response
          }
        });
      }
    });
  } catch (err) {
    // Handle authentication errors
    res.status(500).send({ error: "Internal server error", err });

    console.log(err);
  }
};

// // Check if table exists and create if not
const createTodoTableIfNotExists = (pool1) => {
  // console.log(pool1.Pool);
  const createTableQuery = `
    CREATE TABLE todo (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      description VARCHAR(255),
      status TINYINT(1) DEFAULT 0,
      user_id INT(55)
    );`;
  // Table does not exist, create it
  pool1.query(createTableQuery, (error) => {
    if (error) {
      console.error("Error creating table:", error);
      return false;
    } else {
      console.log("Todo table created successfully");
      return true;
    }
  });
};
// Check if table exists and create if not
const createUserTableIfNotExists = (pool1) => {
  // console.log(pool1.config.database);
  const tableName = "user";
  const checkTableQuery = `SELECT 1 FROM ${tableName} LIMIT 1;`;
  const createTableQuery = `
      CREATE TABLE user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(255),
        lastname VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255),
        role INT DEFAULT 1,
        tenant_uuid VARCHAR(255)
      )`;
  // Table does not exist, create it
  pool1.query(createTableQuery, (error) => {
    if (error) {
      console.error("Error creating table:", error);
      return false;
    } else {
      console.log("User table created successfully");

      return true;
    }
  });
};
module.exports = { handelUserLogin, handelUserRegister };

