'use strict'

const mongoose = require('mongoose')

const discountSchema = new mongoose.Schema({
    id : { type: String },
    description: { type: String },
    amount : { type: Number }
})

module.exports = mongoose.model('Discount', discountSchema)