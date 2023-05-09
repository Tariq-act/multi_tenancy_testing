const { dbConfig, connection } = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const mysql = require("mysql");

// Register handeler function;

const handelUserRegister = (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;
    const time_stamp = Date.now(); // Get current timestamp
    const random_no = Math.random().toString(36).substring(2, 8);
    //creating a random database name for client;
    const tenant_uuid = `${time_stamp}_${random_no}`;

    const q =
      "INSERT INTO registration (`email`, `password`,`tenant_uuid`) VALUES (?)";
    const values = [email, password, tenant_uuid];
    connection.query(q, [values], (err, result) => {
      if (err)
        return res.status(500).send({ error: `cannot process req ${err}` });
      else {
        //creating a database;
        const createDbQ = `CREATE DATABASE tenant_${tenant_uuid}`;

        connection.query(createDbQ, (err, resul) => {
          if (err) {
            return res.status(500).send({ error: `cannot process req ${err}` });
          } else {
            const userDbConfig = {
              ...dbConfig,
              database: `tenant_${tenant_uuid}`,
            };
            const connection1 = mysql.createConnection(userDbConfig);

            connection1.connect((error) => {
              if (error) {
                // console.error("Error connecting to specific db", error);
                console.log(error);
                return res
                  .status(300)
                  .send({ error: `cannot process req ,${error}` });
              } else {
                // Call the function to check and create table
                createTodoTableIfNotExists(connection1);
                createUserTableIfNotExists(connection1);

               console.log(connection1.config.database)
                const q =
                "INSERT INTO user (`email`,`firstname`,`lastname`,`password`,`tenant_uuid`) VALUES (?)";
              const values = [email,firstname,lastname,password,tenant_uuid];
              connection1.query(q, values, (err, result) => {
                if(result){
                res
                  .status(200)
                  .send({result:`Inserted data into tenant_${tenant_uuid} succesfully`,result});
                }
                else {
                  res.status(500)
                  .send({result:`Error while Inserted data into db tenant_${tenant_uuid}`,err});
                }
              })   
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "cannot process req", error });
  }
};

// Login handler function
const handelUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Authenticate user and retrieve user's database information

    const isEmailPresentQ = "SELECT * FROM registration  WHERE email=?";
    const value = [email];
    connection.query(isEmailPresentQ, value, (err, result) => {
      if (err)
        return res.status(300).send({ error: "cannot process req", err });
      else if (result.length === 0) {
        return res.status(301).send({ error: "please sign up first" });
      } else {
      }
    });
  } catch (err) {
    // Handle authentication errors
    res.send(401, "Invalid username or password", err);
    console.log(err);
  }
};

// Check if table exists and create if not
const createTodoTableIfNotExists = (connection) => {
  console.log(connection.config.database);
  const tableName = "todo";
  const checkTableQuery = `SELECT 1 FROM ${tableName} LIMIT 1;`;
  const createTableQuery = `
    CREATE TABLE ${tableName} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      description VARCHAR(255),
      status TINYINT(1)
    );`;
  connection.query(checkTableQuery, (error, results) => {
    if (error) {
      // Table does not exist, create it
      connection.query(createTableQuery, (error) => {
        if (error) {
          console.error("Error creating table:", error);
        } else {
          console.log("Todo table created successfully");
        }
      });
    } else {
      console.log("Todo table already exists");
    }
  });
};
// Check if table exists and create if not
const createUserTableIfNotExists = (connection) => {
  console.log(connection.config.database);
  const tableName = "user";
  const checkTableQuery = `SELECT 1 FROM ${tableName} LIMIT 1;`;
  const createTableQuery = `
      CREATE TABLE ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(255),
        lastname VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255),
        role INT DEFAULT 1,
        tenant_uuid VARCHAR(255)

      );`;
  connection.query(checkTableQuery, (error, results) => {
    if (error) {
      // Table does not exist, create it
      connection.query(createTableQuery, (error) => {
        if (error) {
          console.error("Error creating table:", error);
        } else {
          console.log("User table created successfully");
        }
      });
    } else {
      console.log("User table already exists");
    }
  });
};

module.exports = { handelUserLogin, handelUserRegister };
