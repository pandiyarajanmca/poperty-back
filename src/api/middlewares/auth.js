const httpStatus = require('http-status');
const customResponse = require('../utils/response');
const authService = require("./../services/nosql/auth.service")
const mongoose = require("mongoose")
const {
    errorMessage,
    version,
} = require('../../config/constants');
const jwt = require('jsonwebtoken');
const {
    jwtExpirationInterval,
    jwtSecret,
} = require('../../config/vars');
//const redisCache = require('../utils/redisCache');

exports.generate = (req, res, next) => {
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * jwtExpirationInterval),
        id: req._id,
    }, jwtSecret);
    return token;
};

exports.authVerify = (req, res, next) => {
    const token = req.body.accessToken || req.query.accessToken || req.headers['x-access-token'];
    // verifies secret and checks exp
    jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return customResponse.setResponse(res, false, httpStatus.UNAUTHORIZED, errorMessage.TOKEN_EXPIRED, version.v1, err.name);
            } if (err.name === 'JsonWebTokenError') {
                return customResponse.setResponse(res, false, httpStatus.UNAUTHORIZED, errorMessage.TOKEN_UNAUTHORIZED, version.v1, err.name);
            }
        } else {
            const data = await authService.userByCriteria({ _id: mongoose.Types.ObjectId(decoded.id)});
            if (data) {
                req.decoded = decoded;
                next();
            } else {
                return customResponse.setResponse(res, false, httpStatus.UNAUTHORIZED, errorMessage.TOKEN_EXPIRED, version.v1, "");
            }
        }
    });
};
