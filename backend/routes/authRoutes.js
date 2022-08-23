const express = require('express');
const { login, register } = require('../controllers/authController');

const routes = express.Router();

routes.post('/auth/login', login);
routes.post('/auth/register', register);

module.exports = routes;
