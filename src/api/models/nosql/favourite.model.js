const mongoose = require('mongoose');

const FavouriteSchema = new mongoose.Schema({

    propertyId: {
        type: String
    },
    userId: {
        type: String
    },
    isFavourite: {
        type: Boolean,
        default: true,
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model('Favourite', FavouriteSchema);
