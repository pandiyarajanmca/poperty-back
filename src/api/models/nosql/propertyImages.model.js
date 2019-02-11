const mongoose = require('mongoose');

/**
 * PropertyImages Schema
 * @private
 */

const PropertyImagesSchema = new mongoose.Schema({

  url: {
    type: String,
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  metadata: {
    type: String
  },
  title: {
    type: String
  }
  }, {
    timestamps: true
  });

module.exports = mongoose.model('PropertyImages', PropertyImagesSchema);
