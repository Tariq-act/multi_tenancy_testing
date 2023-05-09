
const {dbConfig } = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const mysql=require("mysql")


// Login handler function
const  handelUserLogin=async (req, res) => {
    try {
      const { username, password } = req.body;
      // Authenticate user and retrieve user's database information
      const databaseName = username;

      

      // Create a new MySQL connection for the user's specific database
      const userDbConfig = { ...dbConfig, database: username };
      const connection = mysql.createConnection(userDbConfig);

      connection.connect((error) => {
        if (error) {
          console.error('Error connecting to specific db', error);
        } else {
          console.log('Connected to specific db');
          // Call the function to check and create table
        }
      });
      // check if todo or user table present or not and create according to that
      createTodoTableIfNotExists(connection)
      createUserTableIfNotExists(connection)
      res.send({result:"Connected to the user database succesfully"})
    } catch (err) {
      // Handle authentication errors
      res.send(401,'Invalid username or password',err);
      console.log(err)
    }
  };


// Check if table exists and create if not
const createTodoTableIfNotExists = (connection) => {
    console.log(connection.config.database)
  const tableName = 'todo';
  const checkTableQuery = `SELECT 1 FROM ${tableName} LIMIT 1;`;
  const createTableQuery = `
    CREATE TABLE ${tableName} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      description VARCHAR(255),
      status TINYINT(1)
    );`
  connection.query(checkTableQuery, (error, results) => {
    if (error) {
      // Table does not exist, create it
      connection.query(createTableQuery, (error) => {
        if (error) {
          console.error('Error creating table:', error);
        } else {
          console.log('Todo table created successfully');
        }
      });
    } else {
      console.log('Todo table already exists');
    }
  });
};
// Check if table exists and create if not
const createUserTableIfNotExists = (connection) => {
    console.log(connection.config.database)
    const tableName = 'user';
    const checkTableQuery = `SELECT 1 FROM ${tableName} LIMIT 1;`;
    const createTableQuery = `
      CREATE TABLE ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(255),
        lastname VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255),
        role INT DEFAULT
      );`
    connection.query(checkTableQuery, (error, results) => {
      if (error) {
        // Table does not exist, create it
        connection.query(createTableQuery, (error) => {
          if (error) {
            console.error('Error creating table:', error);
          } else {
            console.log('User table created successfully');
          }
        });
      } else {
        console.log('User table already exists');
      }
    });
  };


 module.exports={handelUserLogin}