'use strict'

const express = require('express');
const userController = require('../controllers/user');
const api = express.Router();
const middlewareAuth = require('../middleware/authenticated');

const multipart = require('connect-multiparty');
const middlewareUpload = multipart({
    uploadDir: './uploads/users'
});

api.get('/probando-controlador', userController.pruebas);
api.get('/probando-middleware', middlewareAuth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);
api.put('/update-user/:id', middlewareAuth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id', [middlewareAuth.ensureAuth, middlewareUpload], userController.uploadImage);
api.get('/get-image-user/:imageFile', userController.getImageFile);


module.exports = api;