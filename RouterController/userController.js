const jwt = require("jsonwebtoken");
const { dbConfig, connection, pool } = require("../db/db");
const mysql = require("mysql");
const { encryptPassword } = require("../middleware/password.encrypt");
const addUser = (req, res) => {
  try {
    const { email, firstname, lastname, password } = req.body;
    const token = req.cookies.access_token;

    jwt.verify(token, "javascrit", async(err, result) => {
      if (err) {
        return res.status(401).send({ error: "cannot process req", err });
      } else {
      let hashpassword=await encryptPassword(password)

        const insertUserQuery =
          "INSERT INTO user_incomming (email, firstname, lastname, password, role, org_id) VALUES (?, ?, ?, ?, ?, ?)";
        let uuid = result.uuid;
     
        const insertUserValues = [
          email,
          firstname,
          lastname,
          hashpassword,
          0,
          uuid,
        ];
        pool.query(insertUserQuery, insertUserValues, (err, resul) => {
          if (err) {
            // pool.release();
            return res.status(401).send({ error: "cannot process req", err });
          }
          // pool.release();

          const dbName = `tenant_${result.uuid}`;
          const userDbConfig = {
            ...dbConfig,
            database: dbName,
          };
          const pool1 = mysql.createPool(userDbConfig);
          pool1.getConnection((error, connection) => {
            if (error) {
              return res
                .status(401)
                .send({ error: "error while connection to db", error });
            }
            const insertUserQuery =
              "INSERT INTO user (email, firstname, lastname, password, role, tenant_uuid) VALUES (?, ?, ?, ?, ?, ?)";
            let uuid = result.uuid;
            const insertUserValues = [
              email,
              firstname,
              lastname,
              hashpassword,
              0,
              uuid,
            ];
            connection.query(
              insertUserQuery,
              insertUserValues,
              (err, result) => {
                if (err) {
                  connection.release();
                  return res
                    .status(401)
                    .send({ error: "cannot process req", err });
                }
                connection.release();
                res.send("User added successfully");
              }
            );
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.send("error");
  }
};
const getUser = (req, res) => {
  try {
    const { email } = req.query;
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

      pool1.getConnection((error, connection) => {
        if (error) {
          return res
            .status(401)
            .send({ error: "error while connection to db", error });
        }
        const selectUserQuery = "SELECT * FROM user WHERE email = ?";
        const selectUserValues = [email];

        connection.query(selectUserQuery, selectUserValues, (err, result) => {
          if (err) {
            connection.release();
            return res.status(401).send({ error: "cannot process req", err });
          }
          connection.release();
          res.send(result);
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.send("error");
  }
};

const updateUser = (req, res) => {
  try {
    const { email, firstname, lastname, password } = req.body;
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

      pool1.getConnection((error, connection) => {
        if (error) {
          return res
            .status(401)
            .send({ error: "error while connection to db", error });
        }

        console.log("Connected to the database");

        const updateUserQuery =
          "UPDATE user SET firstname = ?, lastname = ?, password = ? WHERE email = ?";
        const updateUserValues = [firstname, lastname, password, email];

        connection.query(updateUserQuery, updateUserValues, (err, result) => {
          if (err) {
            connection.release();
            return res.status(401).send({ error: "cannot process req", err });
          }

          connection.release();
          res.send("User updated successfully");
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.send("error");
  }
};

const deleteUser = (req, res) => {
  try {
    const { email } = req.query;
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

      pool1.getConnection((error, connection) => {
        if (error) {
          return res
            .status(401)
            .send({ error: "error while connection to db", error });
        }

        console.log("Connected to the database");

        const deleteUserQuery = "DELETE FROM user WHERE email = ?";
        const deleteUserValues = [email];

        connection.query(deleteUserQuery, deleteUserValues, (err, result) => {
          if (err) {
            connection.release();
            return res.status(401).send({ error: "cannot process req", err });
          }
          connection.release();
          res.send("User deleted successfully");
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.send("error");
  }
};


module.exports = {
  addUser,deleteUser,updateUser,getUser
};




