// Import Express
const express = require('express');
const authRouter = express.Router();
const { register, login, changePassword, updateUser } = require('../controllers/authController.js');

// Create routes for login and register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.put('/update-user', updateUser);
authRouter.put('/change-password', changePassword);

// Export
module.exports = authRouter;