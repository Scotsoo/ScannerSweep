'use strict';
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    id : { type : Number },
    quantity : { type : Number }
})

module.exports = mongoose.model('Product', productSchema)