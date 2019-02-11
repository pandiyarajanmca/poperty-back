const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
/**
 * Interest Schema
 * @private
 */

const InterestSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4()
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyDetails'
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ["INITIATED", "REJECTED", "OPEN"]
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Interest', InterestSchema);
