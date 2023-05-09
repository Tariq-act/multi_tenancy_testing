const mysql=require("mysql")
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'common_db'
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