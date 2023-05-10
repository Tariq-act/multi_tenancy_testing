const express=require("express")
const app=express()
app.use(express.json());
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connection } = require("./db/db");
const { clientRoute } = require("./Routes/clientRoute");
const { usersRoute } = require("./Routes/userRoute");
const { userTodoRoute } = require("./Routes/todoRoute");


app.use(cors({
  origin:"*"
}))

app.use(cookieParser());

app.use("/client",clientRoute)

app.use('/user',usersRoute)
app.use("/todo",userTodoRoute)
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





