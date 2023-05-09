
const express=require('express')
const { handelUserLogin, handelUserRegister } = require('../RouterController/userController')
const { validate } = require('../middleware/validate')
const usersRoute=express.Router()

usersRoute.post("/register" ,validate,handelUserRegister)
usersRoute.post("/login",handelUserLogin)


module.exports={usersRoute}

