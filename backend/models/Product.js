'use strict';
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    id : { type : String },
    slug : { type : String },
    name : { type : String },
    price : { type : Number }
})

module.exports = mongoose.model('Product', productSchema)