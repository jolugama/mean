const path = require('path');
const fs = require('fs'); 
const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getArtist(req, res) {
    const artistId = req.param.id;
    Artist.findById(artistId, (req, res) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición'
            });
        } else {
            if (!artist) {
                res.status(404).send({
                    message: 'El artista no existe'
                });
            } else {
                res.status(200).send({
                    artist
                });
            }
        }
    });

    res.status(200).send({
        message: 'Método getArtist del controlador artist.js'
    });
}

function saveArtist(req, res) {
    let artist = new Artist;
    let params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({
                message: 'Error al guardar el artista'
            });
        } else {
            if (!artistStored) {
                res.status(404).send({
                    message: 'El artista no ha sido guardado'
                });
            } else {
                res.status(200).send({
                    artist: artistStored
                });
            }
        }


    })
}

function getArtists(req, res) {
    let page;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = 1;
    }
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición'
            });
        } else {
            if (!artists) {
                res.status(404).send({
                    message: 'No hay artistas!'
                });
            } else {
                return res.status(200).send({
                    currentPage:page,
                    total,
                    artists
                });
            }
        }
    });

}


module.exports = {
    getArtist,
    saveArtist,
    getArtists
};