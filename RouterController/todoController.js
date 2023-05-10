const jwt = require("jsonwebtoken");
const { dbConfig, connection } = require("../db/db");
const mysql = require("mysql");
// Handler function to add a new todo
const handelAddTodo = (req, res) => {
  try {
    const { title, description, status } = req.body;
    const token = req.cookies.access_token;
    const user_email = req.cookies.user_email;
    // Verify the access token
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
        } else {
          //if connection done
          const query = "SELECT * FROM user WHERE email = ?";
          pool1.query(query, [user_email], (error, results) => {
            if (error) {
              return callback(error, null);
            }
            if (results.length === 0) {
              return res.send({message:"User not found"}) // User not found
            } else {
              const user_id = results[0].id;
              // Create a new todo in the tenant's database
              const createTodoQuery =
                "INSERT INTO todo (title, description, status, user_id) VALUES (?, ?, ?, ?)";
              const createTodoValues = [title, description, status, user_id];
              pool1.query(createTodoQuery, createTodoValues, (err, result) => {
                if (err) {
                  pool1.release();
                  return res
                    .status(401)
                    .send({ error: "cannot process req", err });
                }
                pool1.release();
                res.send("Todo created successfully");
              });
            }
          });
        }
      });
    });
  } catch (error) {
    console.log(error);
    res.send("error");
  }
};
module.exports = { handelAddTodo };