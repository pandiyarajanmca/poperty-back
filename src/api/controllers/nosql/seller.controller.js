
const fs = require('fs');
const httpStatus = require('http-status');
const customResponse = require('../../utils/response');
const sellerService = require('../../services/nosql/seller.service');
const logger = require('../../utils/logger');
const s3Service = require('../../../util/s3.service');
const {
    errorMessage,
    version,
} = require('../../../config/constants');

//----------------SELLER--------------------//
exports.uploadImage = async (req, res) => {
    try {
        let file = req.files.file;
        let buffer = await fs.readFileSync(file.path)
        s3Service.uploadToS3("project", file.name, buffer, file.type, true, function (err, url) {
            if (err) {
                logger.error(err)
                throw err;
            } else {
                return customResponse.setResponse(
                    res,
                    true,
                    httpStatus.OK,
                    errorMessage.SUCCESS,
                    version.v1,
                    url
                );
            }
        })
    } catch (error) {
        logger.error(controller, methodName, error, JSON.stringify(error));
        return customResponse.setResponse(
            res,
            false,
            httpStatus.INTERNAL_SERVER_ERROR,
            errorMessage.FAILED,
            version.v1,
            error
        );
    }
}

exports.postProperty = async (req, res) => {
    try {
        const result = await sellerService.postProperty(req.body);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.getProperties = async (req, res) => {
    try {
        let page = parseInt(req.params.page);
        let limit = parseInt(req.params.limit);
        const result = await sellerService.getProperties(page,limit);
        const count = await sellerService.getCount();
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result,count);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.getProperty = async (req, res) => {
    try {
        let uuid = req.params.id;
        const result = await sellerService.getProperty(uuid);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        let uuid = req.params.id;
        const result = await sellerService.deleteProperty(uuid);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result===null?"Resource Already Deleted":result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.updateProperty = async (req, res) => {
    try {
        let uuid = req.params.id;
        if(updateSafe(req.body)){
            const result = await sellerService.updateProperty(uuid,req.body);
            return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);  
        }return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, "Unauthorised Updates");
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.listOfInterestedBuyers = async (req, res) => {
    try {
        let uuid = req.params.id;
        const result = await sellerService.listOfInterestedBuyers(uuid);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.listDeals = async (req, res) => {
    try {
        let page = parseInt(req.params.page);
        let limit = parseInt(req.params.limit);
        const result = await sellerService.listDeals(page,limit);
        const count = await sellerService.getListCount();
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result,count);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.dealDetails = async (req, res) => {
    try {
        let uuid = req.params.id;
        const result = await sellerService.dealDetails(uuid);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};


function updateSafe(obj){
    if("agentId" in obj || "dealStatus" in obj||"email" in obj 
    || "isAssignedAgent" in obj|| "isVerified" in obj
    || "status" in obj|| "sellerId" in obj
    || "buyerId" in obj|| "isDeleted" in obj
    || "isBlacklisted" in obj|| "uuid" in obj){
        return false
    }return true;
}