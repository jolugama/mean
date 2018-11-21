'use strict'

const express = require('express');
const userController = require('../controllers/user');
const api = express.Router();
const middlewareAuth = require('../middleware/authenticated');

api.get('/probando-controlador', userController.pruebas);
api.get('/probando-middleware', middlewareAuth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);
api.put('/update-user/:id', middlewareAuth.ensureAuth, userController.updateUser);

module.exports = api;