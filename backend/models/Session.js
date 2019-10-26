'use strict';
const mongoose = require('mongoose')
const Product = require('./Product')

const sessionSchema = new mongoose.Schema({
    id : { type : String },
    items : [{ type : ProductInBasket.schema }]
})

module.exports = mongoose.model('Session', sessionSchema)