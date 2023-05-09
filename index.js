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
app.listen(8090,(err)=>{
if(err){
console.log(err)
}
else {
    connection()
console.log("connected to server")
}
})





