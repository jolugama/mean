'use strict'

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const jwt = require('../services/jwt');

const fs = require('fs');
const path = require('path');



function pruebas(req, res) {
    res.status(200).send({
        message: "Probando una accion del controlador de usuarios del api rest con node y mongo"
    })
}

function saveUser(req, res) {
    let user = new User();
    let params = req.body;
    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = params.role;
    user.image = 'null';

    if (params.password) {
        // encriptar contraseña y guardar datos
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            if (user.name !== null && user.surname !== null && user.email !== null) {
                // guardar el usuario
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({
                            message: 'Error al guardar el usuario',
                            errors: err.errors
                        });
                    } else {
                        if (!userStored) {
                            res.status(404).send({
                                message: 'No se ha registrado el usuario'
                            });
                        } else {
                            res.status(200).send({
                                user: userStored
                            });
                        }
                    }
                })
            } else {
                res.status(200).send({
                    message: 'Rellena todos los datos'
                });
            }
        });
    } else {
        res.status(500).send({
            message: 'Introduce la contraseña'
        });
    }
}

function loginUser(req, res) {
    const params = req.body;
    const email = params.email;
    const password = params.password;
    User.findOne({
            email: email.toLowerCase()
        },
        (err, user) => {
            if (err) {
                res.status(500).send({
                    message: 'Error en la petición'
                });
            } else {
                if (!user) {
                    res.status(404).send({
                        message: 'El usuario no existe'
                    });
                } else {
                    // comprobar la contraseña
                    bcrypt.compare(password, user.password, (err, check) => {
                        if (check) {
                            // devolver los datos del usuario logueado
                            if (params.gethash === 'true') {
                                // devolver un token de jwt
                                res.status(200).send({
                                    token: jwt.createToken(user)
                                });
                            } else {
                                res.status(200).send({
                                    user
                                })
                            }
                        } else {
                            res.status(404).send({
                                message: 'El usuario no ha podido loguearse',
                                err
                            });
                        }
                    })
                }
            }

        });
}

function updateUser(req, res) {
    const userId = req.params.id;
    const update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error al actualizar usuario'
            });
        } else {
            if (!userUpdated) {
                res.status(404).send({
                    message: 'No se ha podido actualizar usuario'
                });
            } else {
                res.status(200).send({
                    user: userUpdated
                });
            }
        }
    })
}

function uploadImage(req, res) {
    const userId = req.params.id;
    let fileName = 'No subido...';

    if (req.files) {
        const filePath = req.files.image.path;
        const fileSPlit = filePath.split('.');
        console.log(fileSPlit);


        const fileExt = fileSPlit[1];
        fileName = fileSPlit.join('.');
        // const fileExt = 'png';

        if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'gif') {
            User.findByIdAndUpdate(userId, {
                image: fileName
            }, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({
                        message: 'No se ha podido actualizar el usuario'
                    });
                } else {
                    res.status(200).send({
                        user: userUpdated
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
    const pathFile = `./uploads/users/${imageFile}`;
    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(200).send({message: 'No existe la imagen...'});
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
}