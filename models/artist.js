'use strict'
 
const mongoose = require ('mongoose');
const mongoosePaginate = require('mongoose-paginate'); // solo util para la vs 1. getArtists.

const artistSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String
})
artistSchema.plugin(mongoosePaginate);  // solo util para la vs 1. getArtists.

module.exports = mongoose.model('Artist',artistSchema);