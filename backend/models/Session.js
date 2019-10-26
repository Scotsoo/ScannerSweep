'use strict';
const mongoose = require('mongoose')
const Product = require('./Product')

const sessionSchema = new mongoose.Schema({
    id : { type : String },
    items : [{
        id : { type : String },
        quantity : { type : Number }
    }]
})

module.exports = mongoose.model('Session', sessionSchema)