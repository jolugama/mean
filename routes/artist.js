'use strict'

const express = require('express');
const artistController = require('../controllers/artist');
const api = express.Router();
const middlewareAuth = require('../middleware/authenticated');

api.get('/artist/:id', middlewareAuth.ensureAuth, artistController.getArtist);
api.post('/artist', middlewareAuth.ensureAuth, artistController.saveArtist);
api.get('/artists/:page?', middlewareAuth.ensureAuth , artistController.getArtists);
api.get('/artists2/:page?', middlewareAuth.ensureAuth , artistController.getArtists2);

module.exports = api;