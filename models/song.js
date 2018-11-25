'use strict'
 
const mongoose = require ('mongoose');
const schema=mongoose.Schema;

const songSchema = new schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album: { type: schema.ObjectId, ref: 'Album'}
})

module.exports = mongoose.model('Song',songSchema);