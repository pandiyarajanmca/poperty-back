const propertyModel = require('../../models/nosql/propertyDetails.model');
const amenityModel = require('../../models/nosql/amenity.model');
const interestModel = require('../../models/nosql/interest.model');
const userModel = require('../../models/nosql/user.model');
const dealModel = require('../../models/nosql/deal.model');
const ratingModel = require('../../models/nosql/rating.model');

//----------------PROPERTIES--------------------//

exports.postProperty = async (input) => {
    try {
        await amenityModel.create(input.amenities)
        input.amenities = (await amenityModel.create(input.amenities))._id;
        return await propertyModel.create(input);
    } catch (error) {
        throw error;
    }
};

exports.getProperties = async (page,limit) => {
    try {
        page = (typeof page !== 'undefined') ?  page : 1;
        limit = (typeof limit !== 'undefined') ?  limit : 10;
        let skip = (page - 1)*limit;
        return await propertyModel.find({isDeleted :false},{},{ skip: skip, limit: limit });
    } catch (error) {
        throw error;
    }
};

exports.getCount = async () => {
    try {
      return await propertyModel.count({isDeleted :false });
    } catch (error) {
      throw error
    }
  }

  exports.getProperty = async (uuid) => {
    try {
        return await propertyModel.find({ uuid: uuid, isDeleted :false});
    } catch (error) {
        throw error;
    }
};

exports.deleteProperty = async (uuid,input) => {
    try {
        return await propertyModel.findOneAndUpdate({ uuid: uuid, isDeleted :false }, { isDeleted :true });
    } catch (error) {
        throw error;
    }
};

exports.updateProperty = async (uuid,input) => {
    try {
        return await propertyModel.findOneAndUpdate({ uuid: uuid }, { input });
    } catch (error) {
        throw error;
    }
};

exports.listOfInterestedBuyers = async (uuid) => {
    try {
        return await interestModel.find({ uuid: uuid});
    } catch (error) {
        throw error;
    }
};

exports.dealDetails = async (uuid) => {
    try {
        return await dealModel.find({ uuid: uuid});
    } catch (error) {
        throw error;
    }
};

exports.listDeals = async (page,limit) => {
    try {
        page = (typeof page !== 'undefined') ?  page : 1;
        limit = (typeof limit !== 'undefined') ?  limit : 10;
        let skip = (page - 1)*limit;
        return await dealModel.find({},{},{ skip: skip, limit: limit });
    } catch (error) {
        throw error;
    }
};

exports.getListCount = async () => {
    try {
      return await dealModel.count({});
    } catch (error) {
      throw error
    }
  }