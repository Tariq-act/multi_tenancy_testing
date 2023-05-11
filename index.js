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

app.get("/",(req,res)=>{

res.status(300).send({result:"Home page"})

})

app.use(cookieParser());
//registering the client and login 
app.use("/client",clientRoute)
//adding a new user thorough client and all crud o/p on user can be performed under this route;
app.use('/user',usersRoute)
//routes releated todo CRUD can be performed under this route;
app.use("/todo",userTodoRoute)
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


