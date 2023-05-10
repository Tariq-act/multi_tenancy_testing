const jwt = require("jsonwebtoken");
const { dbConfig } = require("../db/db");
const mysql = require("mysql");

const handelAddTodo = (req, res) => {
    try {
      const { title, description, status } = req.body;
      const token = req.cookies.access_token;
  
      jwt.verify(token, "javascrit", (err, result) => {
        if (err)
          return res.status(401).send({ error: "cannot process req", err });
  
        const dbName = `tenant_${result.uuid}`;
        const userDbConfig = {
          ...dbConfig,
          database: dbName,
        };
        const pool1 = mysql.createPool(userDbConfig);
  
        pool1.getConnection((error, pool1) => {
          if (error) {
            return res
              .status(401)
              .send({ error: "error while connecting to db", error });
          }
          console.log("Connected to the database");
          const createTodoQuery =
            "INSERT INTO todo (title, description, status, user_id) VALUES (?, ?, ?, ?)";
          const createTodoValues = [title, description, status];
          pool1.query(createTodoQuery, createTodoValues, (err, result) => {
            if (err) {
              pool1.release();
              return res.status(401).send({ error: "cannot process req", err });
            }
            pool1.release();
            res.send("Todo created successfully");
          });
        });
      });
    } catch (error) {
      console.log(error);
      res.send("error");
    }
  };
  module.exports={handelAddTodo}






