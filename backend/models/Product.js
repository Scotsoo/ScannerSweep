'use strict';
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    id : { type : Number },
    slug : { type : String },
    name : { type : String },
    price : { type : Number },
    quantity : { type : Number }
})

module.exports = mongoose.model('Product', productSchema)