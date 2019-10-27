'use strict'
const mongoose = require('mongoose')

const crypticProductSchema = new mongoose.Schema({
    id : String,
    productId : String,
    message : String
})

module.exports = mongoose.model('CrypticProduct', crypticProductSchema)