const acl = require('express-acl');
const {
    errorMessage,
    version,
} = require('../../../config/constants');
const customResponse = require('../../utils/response');
const httpStatus = require('http-status');


const configObject = {
    filename: 'acl.json',
    path: './src/api/middlewares/acl',
    defaultRole: 'admin',
    baseUrl: '/api/v1',
    denyCallback: res => customResponse.setResponse(res, false, httpStatus.FORBIDDEN, errorMessage.ACCESS_DENIED, version, ''),
};

acl.config(configObject);

module.exports = acl;
