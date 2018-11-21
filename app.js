'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// cargar rutas
const userRoutes= require('./routes/user');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// configurar cabeceras http


// rutas base
app.use('/api', userRoutes);

app.get('/test', (req, res)=>{
    res.status(200).send ({message: 'Bienvenido al rest test'})
});




module.exports = app;