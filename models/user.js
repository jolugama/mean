'use strict'

const mongoose = require ('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
})

module.exports = mongoose.model('User',userSchema);