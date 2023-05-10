const express=require('express');
const { addUser, deleteUser, updateUser, getUser } = require('../RouterController/userController');
const { userLogin } = require('../RouterController/clientrouter.userlogin');

const usersRoute=express.Router()
require('dotenv').config();
usersRoute.post("/adduser",addUser)
usersRoute.get("/getuser",getUser)
usersRoute.patch("/updateuser",updateUser)
usersRoute.delete("/deleteuser",deleteUser)
usersRoute.post("/login",userLogin)
module.exports={
    usersRoute
}