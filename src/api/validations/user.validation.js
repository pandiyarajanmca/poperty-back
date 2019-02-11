const Joi = require('joi');

module.exports = {
    getUsers: {
        headers: {
            'x-access-token': Joi.string().required(),
            lang: Joi.string().required(),
        },
    },
};
