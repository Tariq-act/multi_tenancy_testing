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
                "INSERT INTO todo (title, description, user_id) VALUES (?, ?, ?)";
              const createTodoValues = [title, description, user_id];
              pool1.query(createTodoQuery, createTodoValues, (err, result) => {
                if (err) {
                  pool1.release();
                  return res
                    .status(401)
                    .send({ error: "cannot process req", err });
                }
                pool1.release();
                res.status(200).send({message:"Todo created successfully"});
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
const handleDeleteTodo = (req, res) => {
    try {
      const { todoId } = req.params;
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
            // Check if the user exists
            const query = "SELECT * FROM user WHERE email = ?";
            pool1.query(query, [user_email], (error, results) => {
              if (error) {
                return res.status(401).send({ error: "cannot process req", error });
              }
              if (results.length === 0) {
                return res.send({ message: "User not found" });
              } else {
                const user_id = results[0].id;
                // Delete the todo from the tenant's database
                const deleteTodoQuery = "DELETE FROM todo WHERE id = ? AND user_id = ?";
                const deleteTodoValues = [todoId, user_id];
                pool1.query(deleteTodoQuery, deleteTodoValues, (err, result) => {
                  if (err) {
                    pool1.release();
                    return res.status(401).send({ error: "cannot process req", err });
                  }
                  pool1.release();
                  res.status(200).send({ message: "Todo deleted successfully" });
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
  const handleUpdateTodo = (req, res) => {
    try {
      const { todoId } = req.params;
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
            // Check if the user exists
            const query = "SELECT * FROM user WHERE email = ?";
            pool1.query(query, [user_email], (error, results) => {
              if (error) {
                return res.status(401).send({ error: "cannot process req", error });
              }
              if (results.length === 0) {
                return res.send({ message: "User not found" });
              } else {
                const user_id = results[0].id;
                // Update the todo in the tenant's database
                const updateTodoQuery = "UPDATE todo SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?";
                const updateTodoValues = [title, description, status, todoId, user_id];
                pool1.query(updateTodoQuery, updateTodoValues, (err, result) => {
                  if (err) {
                    pool1.release();
                    return res.status(401).send({ error: "cannot process req", err });
                  }
                  pool1.release();
                  res.status(200).send({ message: "Todo updated successfully" });
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

  const handleGetTodo = (req, res) => {
    try {
      const { todoId } = req.params;
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
            // Check if the user exists
            const query = "SELECT * FROM user WHERE email = ?";
            pool1.query(query, [user_email], (error, results) => {
              if (error) {
                return res.status(401).send({ error: "cannot process req", error });
              }
              if (results.length === 0) {
                return res.send({ message: "User not found" });
              } else {
                const user_id = results[0].id;
                // Fetch the todo from the tenant's database
                const getTodoQuery = "SELECT * FROM todo WHERE id = ? AND user_id = ?";
                const getTodoValues = [todoId, user_id];
                pool1.query(getTodoQuery, getTodoValues, (err, result) => {
                  if (err) {
                    pool1.release();
                    return res.status(401).send({ error: "cannot process req", err });
                  }
                  pool1.release();
                  if (result.length === 0) {
                    return res.send({ message: "Todo not found" });
                  } else {
                    const todo = result[0];
                    res.status(200).send({ todo });
                  }
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




  const handleGetAllTodo = (req, res) => {
    try {
      const tenantId = req.headers.tenant_uuid;
      // Connect to the tenant database
      const dbName = `tenant_${tenantId}`;
      const userDbConfig = {
        ...dbConfig,
        database: dbName,
      };
      const pool1 = mysql.createPool(userDbConfig);
  
      pool1.getConnection((error, connection) => {
        if (error) {
          return res
            .status(401)
            .send({ error: "error while connecting to the database", error });
        }
  
        const query = "SELECT * FROM todo";
        connection.query(query, (err, results) => {
          connection.release();
  
          if (err) {
            return res
              .status(401)
              .send({ error: "cannot process request", err });
          }
  
          res.send(results);
        });
      });
    } catch (error) {
      console.log(error);
      res.send("error");
    }
  };
  


module.exports = { handelAddTodo,handleDeleteTodo,handleUpdateTodo,handleGetAllTodo };