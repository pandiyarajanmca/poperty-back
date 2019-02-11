const Joi = require('joi');

module.exports = {
    listProperties: {
        params: Joi.object().keys({
            page: Joi.number().positive().required(),
            limit: Joi.number().required()
        }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        //     })
        //     .unknown()
    },
    verifyProperty: {
        params: Joi.object().keys({
            id: Joi.string().required()
        }),
        body: Joi.object().keys({
            status: Joi.string().required()
        }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        //     })
        //     .unknown()
    },
    updateProperty: {
        params: Joi.object().keys({
            id: Joi.string().required()
        }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        // }).unknown()
    },
    listInterestedBuyers: {
        params: Joi.object().keys({
            id: Joi.string().required()
        }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        //     })
        //     .unknown()
    },
    getInterestedBuyerDetails: {
        params: Joi.object().keys({
            propertyId: Joi.string().required(),
            buyerId: Joi.string().required()
        }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        //     })
        //     .unknown()
    },
    createDeal: {
        body: Joi.object().keys({
            propertyId: Joi.string().required(),
            buyerId: Joi.string().required(),
            status: Joi.string().required(),
            remarks: Joi.string().required(),
        }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        //     })
        //     .unknown()
    },
    listDeals: {
        params: Joi.object().keys({
            propertyId: Joi.string().required(),
        }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        //     })
        //     .unknown()
    },
    getDealDetails: {
        params: Joi.object().keys({
            id: Joi.string().required()
        }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        //     })
        //     .unknown()
    },
    updateDeal: {
        params: Joi.object().keys({
            id: Joi.string().required()
        }),
        body: Joi.object().keys({
            status: Joi.string().required(),
            remarks: Joi.string().required()
        }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        //     })
        //     .unknown()
    },
    getAgentRating: {
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        //     })
        //     .unknown()
    }
};