'use strict';
const Enum = require('../../../config/constants');
const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose); // Will add the Currency type to the Mongoose Schema types
const mongoosastic = require('mongoosastic');
const uuidv4 = require('uuid/v4');
const Currency = mongoose.Types.Currency;

const PropertySchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4()
    },
    propertyName: {
        type: String,
        es_indexed: true
    },
    propertyType: {
        type: Enum,
        values: Enum.propertyType,
        default: 'RESIDENTIAL',
    },
    subCategory: {
        type: String,
        es_indexed: true
    },
    city: {
        type: String,
        required: true,
        es_indexed: true
    },
    locality: {
        type: String,
        required: true,
        es_indexed: true
    },
    address: {
        type: String,
        required: true,
        es_indexed: true
    },
    coordinates: {
        type: { type: String },
        coordinates: []
    },
    showAddressOnWebsite: {
        type: Boolean,
        default: false
    },
    currencyAccepted: {
        type: String
    },
    sellerPrice: {
        type: Currency,
        default: '0'
    },
    agentPrice: {
        type: Currency,
        default: '0'
    },
    numberOfBathrooms: {
        type: Number,
        required: true,
        min: [1, 'Bathrooms Cannot Be Less Than 1'],
        es_indexed: true
    },
    numberOfBedrooms: {
        type: Number,
        required: true,
        min: [1, 'Bedrooms Cannot Be Less Than 1'],
        es_indexed: true
    },
    numberOfRooms: {
        type: Number,
        required: true,
        min: [1, 'Bedrooms Cannot Be Less Than 1'],
        es_indexed: true
    },
    livingArea: {
        type: Number,
        required: true,
        min: [1, 'Area Cannot Be Less Than 1'],
        es_indexed: true
    },
    floorNumber: {
        type: Number
    },
    totalFloors: {
        type: Number
    },
    availableFrom: {
        type: Date,
        default: new Date
    },
    description: {
        type: String,
        es_indexed: true
    },
    buildYear: {
        type: Number
    },
    isParkingAvailable: {
        type: Boolean,
        default: false
    },
    furnishedType: {
        type: Enum,
        values: Enum.furnishedType,
    default: 'NON_FURNISHED',
    },
    amenities: {type: mongoose.Schema.Types.ObjectId, ref: 'Amenity'},
    contactName: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,10})?$/,
    },
    mobilePhone: {
        type: String
    },
    officePhone: {
        type: String
    },
    homePhone: {
        type: String
    },
    showMobilePhone: {
        type: Boolean,
        default: false
    },
    
    showOfficePhone: {
        type: Boolean,
        default: false
    },
    
    showHomePhone: {
        type: Boolean,
        default: false
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dealStatus:{
        type: Enum,
        values: Enum.dealStatus,
        default: 'CLOSED'
    },
    isAssignedAgent: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlacklisted: {
        type: Boolean,
        default: false
    },
    petsAllowed: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: true,
    });

PropertySchema.plugin(mongoosastic, {
    host: 'localhost',
    port: 9200
});

module.exports = mongoose.model('PropertyDetails', PropertySchema);
