const httpStatus = require('http-status');
const customResponse = require('../../utils/response');
const agentService = require('../../services/nosql/agent.service');
const logger = require('../../utils/logger');
const {
    errorMessage,
    version,
} = require('../../../config/constants');

//----------------PROPERTIES--------------------//

exports.listProperties = async (req, res) => {
    try {
        const input = {};
        input.limit = parseInt(req.params.limit);
        input.page = parseInt(req.params.page);
        const result = await agentService.listProperties(input);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.verifyProperty = async (req, res) => {
    try {
        const input = {};
        input.body = req.body;
        input.uuid = req.params.id;
        const result = await agentService.verifyProperty(input);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.updateProperty = async (req, res) => {
    try {
        const input = {};
        input.body = req.body;
        input.uuid = req.params.id;
        const result = await agentService.updateProperty(input);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

//----------------BUYERS--------------------//

exports.listInterestedBuyers = async (req, res) => {
    try {
        const input = {};
        input.propertyId = req.params.propertyId;
        const result = await agentService.listInterestedBuyers(input);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.getInterestedBuyerDetails = async (req, res) => {
    try {
        const input = {};
        input.uuid = req.params.id;
        const result = await agentService.getInterestedBuyerDetails(input);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

//----------------DEALS--------------------//

exports.createDeal = async (req, res) => {
    try {
        const input = {};
        input.body = req.body;
        const result = await agentService.createDeal(input);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.listDeals = async (req, res) => {
    try {
        const input = {};
        input.propertyId = req.params.propertyId;
        const result = await agentService.listDeals(input);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.getDealDetails = async (req, res) => {
    try {
        const input = {};
        input.uuid = req.params.id;
        const result = await agentService.getDealDetails(input);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

exports.updateDeal = async (req, res) => {
    try {
        const input = {};
        input.uuid = req.params.id;
        input.body = req.body;
        const result = await agentService.updateDeal(input);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};

//----------------RATINGS--------------------//

exports.getAgentRating = async (req, res) => {
    try {
        const input = {};
        input.userId = req.params.userId;//decode from token
        const result = await agentService.getAgentRating(input);
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, result);
    } catch (error) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
    }
};