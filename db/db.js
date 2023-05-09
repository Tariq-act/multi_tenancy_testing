const mysql=require("mysql")

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Suvam@7787',
    database: 'common_db'
  };
  const connection = mysql.createConnection(dbConfig);

  module.exports={dbConfig,connection}