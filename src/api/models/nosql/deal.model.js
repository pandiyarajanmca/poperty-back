'use strict';
const Enum = require('../../../config/constants');
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

const dealsSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4()
      },
propertyId: {type: mongoose.Schema.Types.ObjectId, ref: 'PropertyDetails'},
buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
dealStatus:{
    type: Enum,
    values: Enum.dealStatus,
    default: 'CLOSED'
},
description: {
    type: String,
    es_indexed: true
},
  timestamp: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Deal', dealsSchema);