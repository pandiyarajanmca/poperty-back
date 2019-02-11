'use strict';
const Enum = require('../../../config/constants');
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
ratings: {
    type: Number,
},
count: {
    type: Number,
},
  timestamp: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Rating', ratingSchema);