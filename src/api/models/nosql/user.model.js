const mongoose = require('mongoose');
Schema = mongoose.Schema;

/**
 * Users Schema
 * @private
 */

const UsersSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["USER", "AGENT", "ADMIN"],
      default: "USER"
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    name: { type: String, trim: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number },
    countryCode: { type: Number },
    profilePic: { type: String, default: "" },
    location: { type: String, default: "" },
    activationCode: { type: String, default: "" },
    otp: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      enum: ["ACTIVE", "PENDING", "INACTIVE"],
      default: "PENDING"
    },
  },
  {
    timestamps: true
  }
);

/**
 * @typedef OAuthUsers
 */

module.exports = mongoose.model('Users', UsersSchema);
