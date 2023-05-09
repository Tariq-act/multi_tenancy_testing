


const express=require('express');
const { handelAddTodo } = require('../RouterController/todoController');

const clientRoute=express.Router()
require('dotenv').config();


clientRoute.post('/todo', handelAddTodo)

module.exports={
    clientRoute
}