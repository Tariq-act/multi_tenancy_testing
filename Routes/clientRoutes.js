const express=require('express');
const { handelAddTodo } = require('../RouterController/todoController');
const { addClint } = require('../RouterController/clientController');
const clientRoute=express.Router()
require('dotenv').config();
clientRoute.post('/todo', handelAddTodo)
clientRoute.post("/addclint",addClint)
module.exports={
    clientRoute
}