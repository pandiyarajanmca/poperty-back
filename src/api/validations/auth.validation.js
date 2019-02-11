const Joi = require("joi");

module.exports = {
	// POST /v1/auth/register
	register: {
		body: Joi.object().keys({
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			countryCode: Joi.number().optional(),
			phoneNumber: Joi.number()
				.integer()
				.optional(),
			email: Joi.string()
				.required()
				.email(),
			password: Joi.string()
				.required()
				.min(6)
				.max(128)
		})
	},

	// POST /v1/auth/login
	login: {
		body: Joi.object().keys({
			email: Joi.string()
				.required()
				.email(),
			password: Joi.string()
				.required()
				.min(6)
				.max(128)
		})
	},

	// POST /v1/auth/forgot-password
	forgotPassword: {
		body: {
			email: Joi.string()
				.email()
				.required()
		}
	},

	// POST /v1/auth/reset-password
	resetPassword: {
		body: {
			password: Joi.string()
			.required()
			.min(6)
			.max(128),
			code: Joi.string().required()
		}
	},
  resendEmailVerification: {
    body: {
      email: Joi.string().email().required(),
    }
  },
	// PUT /v1/auth/activate
	verifyEmail: {
		body: {
			code: Joi.string().required()
		}
  },
  //auth /v1/auth/change-password
  changePassword: {
    body: {
      oldPassword: Joi.string().min(6).required(),
      newPassword: Joi.string()
			.required()
			.min(6)
			.max(128)
    },
    headers: {
      'x-access-token': Joi.string().required()
    },
  },
  checkEmailExist: {
    body: {
      email: Joi.string().email().required(),
    }
  },
	sendOtp: {
		body: {
      phoneNumber: Joi.number().integer(),
      countryCode: Joi.number().optional(),
    },
    headers: {
      'x-access-token': Joi.string().required()
    }
	},
	verifyPhone: {
		body: {
      otp: Joi.string().min(6).max(6).required(),
    },
    headers: {
      'x-access-token': Joi.string().required()
    }
	}
};
