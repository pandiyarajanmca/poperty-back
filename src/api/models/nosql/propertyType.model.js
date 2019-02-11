const Enum = require('../../../config/constants');
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

/**
 * PropertyType Schema
 * @private
 */

const PropertyTypeSchema = new mongoose.Schema({

  uuid: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4()
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    values: Enum.propertyType
  },
}, {
    timestamps: true
  });

module.exports = mongoose.model('PropertyType', PropertyTypeSchema);
