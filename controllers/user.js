'use strict'
 
const bcrypt = require('bcrypt-nodejs');
var User=require('../models/user');
var jwt = require ('../services/jwt');

function pruebas(req, res){
    res.status(200).send({
        message: "Probando una accion del controlador de usuarios del api rest con node y mongo"
    })
}

function saveUser(req,res) {
    let user = new User();
    let params= req.body;
    console.log(params);
    
    user.name=params.name;
    user.surname=params.surname;
    user.email=params.email;
    user.role='ROLE_USER';
    user.image='null';

    if(params.password){
        // encriptar contraseña y guardar datos
        bcrypt.hash(params.password,null,null,(err,hash)=>{
            user.password = hash;
            if(user.name !==null && user.surname !==null && user.email!==null
                && user.name.length>3 && user.surname.length>3 && user.email.length>5 ){
                // guardar el usuario
                user.save((err,userStored)=>{
                    if(err){
                        res.status(500).send({message:'Error al guardar el usuario'});
                    }else {
                        if(!userStored){
                            res.status(404).send({message:'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user:userStored});
                        }
                    }
                })
            }else{
                res.status(200).send({message: 'Rellena todos los datos'});
            }
        });
    }else {
        res.status(500).send({message: 'Introduce la contraseña'});
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
            if(err){
                res.status(500).send({ message: 'Error en la petición'});
            } else {
                if(!user){
                    res.status(404).send({message:'El usuario no existe'});
                }else {
                    // comprobar la contraseña
                    bcrypt.compare(password, user.password, (err, check)=>{
                        if(check){
                            // devolver los datos del usuario logueado
                            if(params.gethash){
                                // devolver un token de jwt
                                res.status(200).send({
                                    token: jwt.createToken(user)
                                });
                            }else{
                                res.status(200).send({user})
                            }
                        }else {
                            res.status(404).send({message:'El usuario no ha podido loguearse', err});
                        }
                    })
                }
            }

        });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser
}