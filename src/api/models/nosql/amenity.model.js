const mongoose = require('mongoose');

/**
 * Amenity Schema
 * @private
 */

const AmenitySchema = new mongoose.Schema({

  type: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  category: {
    type: [String],
  },
}, {
    timestamps: true
  });

module.exports = mongoose.model('Amenity', AmenitySchema);
