'use strict';
const mongoose = require('mongoose')

const challengeSchema = new mongoose.Schema({
    id : { type : String },
    text : { type : String }
})

module.exports = mongoose.model('Challenge', challengeSchema)