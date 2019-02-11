const Joi = require('joi');

module.exports = {
    uploadImage: {
        files : {
            file : Joi.binary().required()
        }
    },
    postProperty: {
        body: Joi.object().keys({
            city: Joi.string().required(),
            locality:Joi.string().required(),
            address:Joi.string().required(),
            numberOfBathrooms:Joi.number().required(),
            numberOfBedrooms:Joi.number().required(),
            numberOfRooms:Joi.number().required(),
            livingArea:Joi.number().required(),
            email:Joi.string().required().email()
        }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        //     })
        //     .unknown()
    },
    getProperties: {
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
    getProperty: {
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
    deleteProperty: {
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
    updateProperty:{
        params: Joi.object().keys({
            id: Joi.string().required()
          }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        // }).unknown()
    },
    listOfInterestedBuyers: {
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
    listDeals: {
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
    dealDetails: {
        params: Joi.object().keys({
            id: Joi.string().required()
          }),
        // headers: Joi.object()
        //     .keys({
        //         'lang': Joi.string().required(),
        //         'x-access-token': Joi.string().required(),
        //     })
        //     .unknown()
    }
};