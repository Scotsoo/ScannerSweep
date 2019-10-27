'use strict';
const mongoose = require('mongoose')

const challengeSchema = new mongoose.Schema({
    id : String,
    discount : Number,
    text : String,
    product : String,
    timeRemaining : Number
})

module.exports = mongoose.model('Challenge', challengeSchema)