'use strict';
const mongoose = require('mongoose')

const challengeSchema = new mongoose.Schema({
    id : String,
    text : String,
    timeRemaining : Number
})

module.exports = mongoose.model('Challenge', challengeSchema)