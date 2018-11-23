'use strict'

const express = require('express');
const artistController = require('../controllers/artist');
const api = express.Router();
const middlewareAuth = require('../middleware/authenticated');

api.get('/artist/:id', middlewareAuth.ensureAuth, artistController.getArtist);
api.post('/artist', middlewareAuth.ensureAuth, artistController.saveArtist);
api.get('/artists/:page?', middlewareAuth.ensureAuth , artistController.getArtists);

module.exports = api;