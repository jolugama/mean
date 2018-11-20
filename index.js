'use strict'

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 5555; 

mongoose.connect('mongodb://localhost:27017/mean', options,
    (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('Conectada con la bbdd...');
            
            app.listen(port, ()=>{
                console.log(`Servidor del api rest música escuchando en http://localhost:${port}`);
            })

        }
    });