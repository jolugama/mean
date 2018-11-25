'use strict'

const express = require('express');
const artistController = require('../controllers/artist');
const api = express.Router();
const middlewareAuth = require('../middleware/authenticated');

const multipart = require('connect-multiparty');
const middlewareUpload = multipart({
    uploadDir: './uploads/artists'
});

api.get('/artist/:id', middlewareAuth.ensureAuth, artistController.getArtist);
api.post('/artist', middlewareAuth.ensureAuth, artistController.saveArtist);
api.get('/artists/:page?', middlewareAuth.ensureAuth, artistController.getArtists);
api.get('/artists2/:page?', middlewareAuth.ensureAuth, artistController.getArtists2);
api.put('/artist/:id', middlewareAuth.ensureAuth, artistController.updateArtist);
api.delete('/artist/:id', middlewareAuth.ensureAuth, artistController.deleteArtist);
api.post('/upload-image-artist/:id',[middlewareAuth.ensureAuth,middlewareUpload], artistController.uploadImage)
api.get('/get-image-artist/:imageFile', artistController.getImageFile);

module.exports = api;