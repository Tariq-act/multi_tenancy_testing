const express = require('express');
const { handelAddTodo, handleDeleteTodo, handleUpdateTodo } = require('../RouterController/todoController');


const userTodoRoute = express.Router();

require('dotenv').config();

// Route for adding a todo
userTodoRoute.post('/addtodo', handelAddTodo);
// Route for get todos
userTodoRoute.post('/alltodo', handelAddTodo);
// Route for delete a todo
userTodoRoute.post('/delete', handleDeleteTodo);
// Route for update a todo
userTodoRoute.post('/addtodo', handleUpdateTodo);

module.exports={userTodoRoute}