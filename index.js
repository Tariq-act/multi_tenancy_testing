const express=require("express")
const app=express()
app.use(express.json());
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./db/db");
const { usersRoute } = require("./Routes/user");
app.use(cors({
  origin:"*"
}))
app.use("/user",usersRoute)









// Connect to the MySQL server
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL:', error);
  } else {
    console.log(`Connected to database_${connection.config.database}_${connection.threadId}`);
  
    // Call the function to check and create table
  }
});

app.listen(8090,(err)=>{

if(err){
console.log(err)
}
else {
console.log("connected to server")
}
})





