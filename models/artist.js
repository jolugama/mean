'use strict'
 
const mongoose = require ('mongoose');

const artistSchema = mongoose.Schema({
    name: String,
    description: String,
    image: String
})

module.exports = mongoose.model('Artist',artistSchema);