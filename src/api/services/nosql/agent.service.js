const propertyModel = require('../../models/nosql/propertyDetails.model');
const interestModel = require('../../models/nosql/interest.model');
const userModel = require('../../models/nosql/user.model');
const dealModel = require('../../models/nosql/deal.model');
const ratingModel = require('../../models/nosql/rating.model');

//----------------PROPERTIES--------------------//

exports.listProperties = async (input) => {
    try {
        input.filter = {};
        const count = await schemaModel.count(input.filter);
        var page = (typeof input.page !== 'undefined') ? page : 1;
        var limit = (typeof input.limit !== 'undefined') ? limit : 10;
        const properties = await propertyModel.find({ isDeleted: false }, input.filter).sort({ _id: -1 }).skip(limit * page).limit(limit).select('');
        return { count, properties };
    } catch (error) {
        throw error;
    }
};

exports.verifyProperty = async (input) => {
    try {
        const result = await propertyModel.findOneAndUpdate({ uuid: input.uuid }, { status: "" });
        return result;
    } catch (error) {
        throw error;
    }
};

exports.updateProperty = async (input) => {
    try {
        const result = await propertyModel.findOneAndUpdate({ uuid: input.uuid }, input.body);
        return result;
    } catch (error) {
        throw error;
    }
};

//----------------BUYERS--------------------//

exports.listInterestedBuyers = async (input) => {
    try {
        const count = await interestModel.count({ propertyId: input.propertyId })
        const list = await interestModel.find({ propertyId: input.propertyId }).populate('buyerId');
        return { count, list };
    } catch (error) {
        throw error;
    }
};

exports.getInterestedBuyerDetails = async (input) => {
    try {
        const result = await userModel.find({ id: input.uuid });
        return result;
    } catch (error) {
        throw error;
    }
};

//----------------DEALS--------------------//

exports.createDeal = async (input) => {
    try {
        const query = { $and: [{ propertyId: input.body.propertyId, buyerId: input.body.buyerId }] }
        const deal = await dealModel.find(query);
        if (deal) {
            throw new Error("Deal already exists");
        }
        let newSchema = new dealModel({ propertyId: input.body.propertyId, buyerId: input.body.buyerId, staus: "OPEN", remarks: input.body.remarks });
        const result = await newSchema.save();
        return result._id;
    } catch (error) {
        throw error;
    }
};

exports.listDeals = async (input) => {
    try {
        const count = await dealModel.count({ propertyId: input.propertyId });
        const list = await dealModel.find({ propertyId: input.propertyId }).populate('buyerId').populate('agentId');
        return { count, list };
    } catch (error) {
        throw error;
    }
};

exports.getDealDetails = async (input) => {
    try {
        const deal = await deal.find({ uuid: input.uuid }).populate('buyerId').populate('propertyId').populate('agentId');
        return deal;
    } catch (error) {
        throw error;
    }
};

exports.updateDeal = async (input) => {
    try {
        const result = await dealModel.findOneAndUpdate({ uuid: input.uuid }, input.body);
        return result;
    } catch (error) {
        throw error;
    }
};

//----------------RATINGS--------------------//

exports.getAgentRating = async (input) => {
    try {
        const rating = await ratingModel.find({ userId: input.userId }).select('rating');
        return rating;
    } catch (error) {
        throw error;
    }
};