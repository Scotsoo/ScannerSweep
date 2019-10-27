'use strict';
const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    id : { type : String },
    items : [{
        id : { type : String },
        quantity : { type : Number }
    }],
    discounts : [{
        id : { type: String }
    }]
})

module.exports = mongoose.model('Session', sessionSchema)