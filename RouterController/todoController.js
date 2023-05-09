
const jwt= require('jsonwebtoken');
const { dbConfig } = require('../db/db');
const mysql=require('mysql')

const handelAddTodo=(req,res)=>{
    try {
        const {email}=req.body;
        const token = req.cookies.access_token;
        
        //after getting the token we need to verify it and retrive the db name from it;

        jwt.verify(token, "javascrit",(err,result)=>{
            if(err)return res.status(401).send({"error":"cannot process req",err})
           
            //after getting the result get the db name and connect to the database;

            const dbName=`tenant_${result.uuid}`
            
            //now we can connect to database;

            const userDbConfig = {
                ...dbConfig,
                database: dbName,
              };
              const pool1 = mysql.createPool(userDbConfig);
              
  
              pool1.getConnection(async (error, result) => {
  if(error){return res.status(401).send({"error":"error while connection to db",error})
}
  console.log("connected to db")
  
              })
              console.log(` database connected ${pool1.config.connectionConfig.database}`)


              //check if user with this email id is pressent or not;

              const q="SELECT * FROM user WHERE email=?"

              pool1.query(q,[email],(err,result)=>{
                if(err){
                    return res.status(401).send({"error":"cannot process req",err})
                }
                 
              })

        })
        

    } catch (error) {
        console.log(error)
        res.send('error')
    }
}
module.exports={
    handelAddTodo
}