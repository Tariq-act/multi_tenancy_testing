const express=require('express');
const { addUser, deleteUser, updateUser, getUser, userLogin, handleGetAllUser } = require('../RouterController/userController');
const { validateAdmin } = require('../middleware/validateadmin');

const usersRoute=express.Router()
require('dotenv').config();
usersRoute.post("/login",userLogin)
usersRoute.use("/",validateAdmin)
usersRoute.post("/adduser",addUser)
usersRoute.get("/getuser/:id",getUser)
usersRoute.patch("/updateuser/:id",updateUser)
usersRoute.delete("/deleteuser/:id",deleteUser)
usersRoute.get("/getalluser",handleGetAllUser)

module.exports={
    usersRoute
}