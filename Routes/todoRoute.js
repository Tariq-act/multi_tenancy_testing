const express = require('express');
const { handelAddTodo, handleDeleteTodo, handleUpdateTodo, handleGetAllTodo } = require('../RouterController/todoController');
const { validateAdmin } = require('../middleware/validateadmin');


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
// Route to get all todo
userTodoRoute.get('/alltodo',validateAdmin,handleGetAllTodo);

module.exports={userTodoRoute}