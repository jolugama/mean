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
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Origin','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Allow-Request-Method');
    res.header('Access-Controll-Alow-Methods','GET, POST, OPTIONS,PUT, DELETE');
    res.header('Allow','GET, POST, OPTIONS,PUT, DELETE');

    next();
});

// rutas base
app.use('/api', userRoutes); 
app.use('/api', artistRoutes);

app.get('/test', (req, res)=>{
    res.status(200).send ({message: 'Bienvenido al rest test'})
});


module.exports = app;