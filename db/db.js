const mysql=require("mysql")
require("dotenv").config()
const dbConfig = {
  host: process.env.host,
  user: process.env.database_user,
  password: process.env.database_password,
  database: process.env.database_name
}
  const pool = mysql.createPool(dbConfig);
  
  const connection = () => {
    pool.getConnection((err, result) => {
      if (err) {
        console.log("error while connnecting to DB");
      } else {
        console.log("successfully connected to ", result.threadId, result.config.database);
      }
    });
  };
  module.exports={dbConfig,connection,pool}