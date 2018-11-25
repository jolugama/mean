'use strict'
 
const mongoose = require ('mongoose');
const schema=mongoose.Schema;

const albumSchema = new schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type: schema.ObjectId, ref: 'Artist'}
})

module.exports = mongoose.model('Album',albumSchema); 