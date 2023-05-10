
const express=require('express')
const {  handelClientLogin, handelClientRegister } = require('../RouterController/clientController')
const { validate } = require('../middleware/validate')
const clientRoute=express.Router()

clientRoute.post("/register" ,validate,handelClientRegister)
clientRoute.post("/login", handelClientLogin)


module.exports={clientRoute}

