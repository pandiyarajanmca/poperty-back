const Joi = require("joi");

module.exports = {
  createAgent: {
    body: {
      firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			countryCode: Joi.number().optional(),
			phoneNumber: Joi.number()
				.integer()
				.optional(),
			email: Joi.string()
				.required()
				.email(),
    },
    headers: {
      'x-access-token': Joi.string().required()
    },
  },
  updateAgent: {
    params: {
      agentId: Joi.string().required()
    },
    body: {
      firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			countryCode: Joi.number().optional(),
			phoneNumber: Joi.number()
				.integer()
				.optional(),
			email: Joi.string()
				.required()
				.email(),
    },
    headers: {
      'x-access-token': Joi.string().required()
    },
  },
  getUserDetails: {
    params: {
      userId: Joi.string().required()
    },
    headers: {
      'x-access-token': Joi.string().required()
    },
  },
  getUserList: {
    headers: {
      'x-access-token': Joi.string().required()
    },
    body: {
      type: Joi.string().required().allow('ADMIN', 'USER'),
      page: Joi.number().integer().optional().min(0),
      limit: Joi.number().integer().optional().positive()
    }
  },
  getList: {
    headers: {
      'x-access-token': Joi.string().required()
    },
    params: {
      page: Joi.number().integer().required().min(0),
      limit: Joi.number().integer().required().positive()
    }
  },
  getPropertyDetails: {
    params: {
      propertyId: Joi.string().required()
    },
    headers: {
      'x-access-token': Joi.string().required()
    },
  },
  dealDetails: {
    params: {
      dealId: Joi.string().required()
    },
    headers: {
      'x-access-token': Joi.string().required()
    },
  },
  assignPropertyToAgent: {
    headers: {
      'x-access-token': Joi.string().required()
    },
    body: {
      propertyId: Joi.string().required(),
      agentId: Joi.string().required()
    }
  }
};
