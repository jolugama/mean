const path = require('path');
const fs = require('fs');
// let mongoosePaginate = require('mongoose-paginate');


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

    var options = {
        sort: {
            name: 1 // poner -1 para sentido inverso
        },
        limit: 5, // por página
        page: parseInt(page)

    };

    Artist.paginate({}, options).then(function (result) {
        if (!result) {
            res.status(404).send({
                message: 'No hay artistas!'
            });
        } else {
            if (result.page > result.pages) {
                res.status(404).send({
                    message: 'Página no encontrada.'
                });
            }
        }


        return res.status(200).send({
            currentPage: result.page,
            pages: result.pages,
            total: result.total,
            artists: result.docs
        });

    });

}

function getArtists2(req, res) {
    let page;
    const perPage = 5;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = 0;
    }


    Artist.find({}, 'name description image')
        .skip(Number(page) * perPage)
        .limit(perPage)
        .exec(
            (err, artists) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error de Artistas' + err
                    })
                }

                Artist.count({}, (err, cont) => {
                    res.status(200).send({
                        currentPage: page,
                        artists,
                        total: cont
                    })
                })
            }
        )
}

function updateArtist(req, res) {
    const artistId = req.params.id;
    const update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al guardar el artista'
            });
        }

        if (!artistUpdated) {
            res.status(404).send({
                message: 'El artista no ha sido actualizado'
            });
        } else {
            res.status(200).send({
                artist: artistUpdated
            });
        }
    });
}


function deleteArtist(req, res) {
    const artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al guardar el artista'
            });
        }

        if (!artistRemoved) {
            res.status(404).send({
                message: 'El artista no ha sido eliminado'
            });
        } else {

            Album.find({
                artist: artistRemoved._id
            }).remove((err, albumRemoved) => {
                if (err) {
                    return res.status(500).send('Error al eliminar el album');
                }

                if (!albumRemoved) {
                    res.status(404).send({
                        mesage: 'El album no ha sido eliminado'
                    });
                } else {


                    Song.find({
                        album: albumRemoved._id
                    }).remove((err, songRemoved) => {
                        if (err) {
                            return res.status(500).send('Error al eliminar la canción');
                        }

                        if (!songRemoved) {
                            res.status(404).send({
                                mesage: 'la canción no ha sido eliminado'
                            });
                        } else {
                            res.status(200).send({
                                artist: artistRemoved
                            })

                        }
                    });


                }
            });
        }

    })
}


function uploadImage(req, res) {
    const artistId = req.params.id;
    let fileName = 'No subido...';

    if (req.files) {
        const filePath = req.files.image.path;
        const fileSPlit = filePath.split('.');
        console.log(fileSPlit);


        const fileExt = fileSPlit[1];
        fileName = fileSPlit.join('.');
        // const fileExt = 'png';

        if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'gif') {
            Artist.findByIdAndUpdate(artistId, {
                image: fileName
            }, (err, artistUpdated) => {
                if (!artistUpdated) {
                    res.status(404).send({
                        message: 'No se ha podido actualizar el usuario'
                    });
                } else {
                    res.status(200).send({
                        artist: artistUpdated
                    });
                }
            })
        } else {
            res.status(200).send({
                message: 'Extensión del archivo no válida'
            });
        }

        console.log(fileName);
    } else {
        res.status(200).send({
            message: 'No has subido ninguna imagen...'
        });
    }
}

function getImageFile(req, res) {
    let imageFile = req.params.imageFile;
    const pathFile = `./uploads/artists/${imageFile}`;
    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(200).send({message: 'No existe la imagen...'});
        }
    })
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    getArtists2,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};