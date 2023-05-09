const mysql=require("mysql")

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'common_db'
  };
  const connection = mysql.createConnection(dbConfig);

  module.exports={dbConfig,connection}