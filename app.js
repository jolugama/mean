'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// cargar rutas
const userRoutes= require('./routes/user');
const artistRoutes= require('./routes/artist');

// configuracion body-parser. ver web.
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// fin configuracion body-parser

// configurar cabeceras http
//CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);

// rutas base
app.use('/api', userRoutes); 
app.use('/api', artistRoutes);

app.get('/test', (req, res)=>{
    res.status(200).send ({message: 'Bienvenido al rest test'})
});


module.exports = app;