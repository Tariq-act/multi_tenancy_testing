const express = require('express');
const { handelAddTodo } = require('../RouterController/todoController');


const userTodoRoute = express.Router();

require('dotenv').config();

// Route for adding a todo
userTodoRoute.post('/addtodo', handelAddTodo);
userTodoRoute.post('/addtodo', handelAddTodo);
userTodoRoute.post('/addtodo', handelAddTodo);
userTodoRoute.post('/addtodo', handelAddTodo);

module.exports={userTodoRoute}