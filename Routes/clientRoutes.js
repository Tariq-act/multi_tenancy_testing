const express = require('express');
const { handelAddTodo } = require('../RouterController/todoController');
const { addClint } = require('../RouterController/clientController');
const { userLogin } = require('../RouterController/clientrouter.userlogin');

const clientRoute = express.Router();

require('dotenv').config();

// Route for adding a todo
clientRoute.post('/addtodo', handelAddTodo);

// Route for adding a client
clientRoute.post("/addclient", addClint);

// Route for user login
clientRoute.post("/userlogin", userLogin);

module.exports = {
  clientRoute
};
