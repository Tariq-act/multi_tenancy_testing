const mysql=require("mysql")

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Suvam@7787',
    database: 'school'
  };
  const connection = mysql.createConnection(dbConfig);

  module.exports={dbConfig,connection}