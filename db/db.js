const mysql=require("mysql")
require("dotenv").config()
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Suvam@7787",
  database: process.env.database_name,
  connectionLimit: 100,

}
  const pool = mysql.createPool(dbConfig);
  
  const connection = () => {
    pool.getConnection((err, result) => {
      if (err) {
        console.log("error while connnecting to DB",err);
      } else {
        console.log("successfully connected to ", result.threadId, result.config.database);
      }
    });
  };
  module.exports={dbConfig,connection,pool}