'use strict';
const mongoose = require('mongoose')
const Product = require('./Product')

const sessionSchema = new mongoose.Schema({
    id : { type : String },
    items : [{ type : Product.schema }]
})

module.exports = mongoose.model('Session', sessionSchema)