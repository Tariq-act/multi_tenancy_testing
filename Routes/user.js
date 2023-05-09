
const express=require('express')
const { handelUserLogin } = require('../RouterController/userController')
const usersRoute=express.Router()
usersRoute.post("/login",handelUserLogin)

module.exports={usersRoute}

