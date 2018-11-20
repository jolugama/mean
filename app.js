'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// cargar rutas

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// configurar cabeceras http

// rutas base
app.get('/test', (req, res)=>{
    res.status(200).send ({message: 'Bienvenido al rest test'})
});




module.exports = app;