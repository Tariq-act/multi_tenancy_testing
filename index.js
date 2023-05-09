const express=require("express")
const app=express()
app.use(express.json());
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connection } = require("./db/db");
const { usersRoute } = require("./Routes/user");
const { clientRoute } = require("./Routes/clientRoutes");
app.use(cors({
  origin:"*"
}))

app.use(cookieParser());


app.use("/user",usersRoute)

app.use('/post',clientRoute)


// Connect to the MySQL server
app.listen(8080,(err)=>{
if(err){
console.log(err)
}
else {
    connection()
console.log("connected to server")
}
})





