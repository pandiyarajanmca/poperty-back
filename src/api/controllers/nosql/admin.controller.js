const httpStatus = require("http-status");
const randomstring = require("randomstring");
const customResponse = require("../../utils/response");
const logger = require("../../utils/logger");
const adminService = require("../../services/nosql/admin.service");
const authService = require("../../services/nosql/auth.service");
const mongoose = require("mongoose");
const {
	userRole,
	errorMessage,
	version,
	emailTemplateMapping
} = require("../../../config/constants");
const { frontHost } = require("../../../config/vars");
const emailService = require("../../utils/email");
const emailTemplate = require("../../utils/emailTemplate.json");
const controller = "[adminController]";
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

exports.createAgent = async (req, res) => {
	const methodName = "[createAgent]";
	try {
		let reqData = Object.assign({}, req.body);
		const password = randomstring.generate({ length: 6 });
		const activationCode = randomstring.generate({
			length: 64
		});
		reqData = { role: userRole.AGENT, password, activationCode, ...reqData };
		result = await authService.createUser(reqData);
		if (result && result.email) {
			let accountDetails = {
				email: result.email
			};
			// key replace string to be replace and value represents its replaced value;
			let emailVariables = {
				USERNAME: result.firstName,
				ACTIVATE_LINK: `${frontHost}/email-verification?code=` + activationCode,
				PASSWORD: password
			};
			emailService.sendEmailTemplate(
				emailVariables,
				accountDetails,
				emailTemplate[
					emailTemplateMapping.sendEmailVerificationMailWithPassword
				]
			);
			return customResponse.setResponse(
				res,
				true,
				httpStatus.CREATED,
				errorMessage.AGENT_CREATED,
				version.v1,
				[]
			);
		} else {
			return customResponse.setResponse(
				res,
				false,
				httpStatus.EXPECTATION_FAILED,
				errorMessage.FAILED,
				version.v1,
				[]
			);
		}
	} catch (error) {
		logger.error(controller, methodName, error, JSON.stringify(error));
		if (error.code == 11000) {
			return customResponse.setResponse(
				res,
				false,
				httpStatus.EXPECTATION_FAILED,
				errorMessage.EMAIL_ALREADY_EXISTS,
				version.v1,
				[]
			);
		}
		return customResponse.setResponse(
			res,
			false,
			httpStatus.INTERNAL_SERVER_ERROR,
			errorMessage.FAILED,
			version.v1,
			error
		);
	}
};
exports.updateAgent = async (req, res) => {
	const methodName = "[updateAgent]";
	try {
		let reqData = Object.assign({}, req.body);
		let { agentId } = req.params;

		let user = await authService.userByCriteria({
			_id: mongoose.Types.ObjectId(agentId)
		});
		if (user) {
			const password = randomstring.generate({ length: 6 });
			const activationCode = randomstring.generate({
				length: 64
			});
			if (reqData.email != user.email) {
				reqData = {
					password: bcrypt.hashSync(password, salt),
					activationCode,
					...reqData
				};
			}
			result = await adminService.updateAgent(
				{
					_id: mongoose.Types.ObjectId(agentId)
				},
				reqData
			);

			if (reqData.email != user.email) {
				let accountDetails = {
					email: reqData.email
				};
				// key replace string to be replace and value represents its replaced value;
				let emailVariables = {
					USERNAME: reqData.firstName,
					ACTIVATE_LINK:
						`${frontHost}/email-verification?code=` + activationCode,
					PASSWORD: password
				};
				emailService.sendEmailTemplate(
					emailVariables,
					accountDetails,
					emailTemplate[
						emailTemplateMapping.sendEmailVerificationMailWithPassword
					]
				);
			}
			return customResponse.setResponse(
				res,
				true,
				httpStatus.ACCEPTED,
				errorMessage.AGENT_UPDATED,
				version.v1,
				[result]
			);
		} else {
			return customResponse.setResponse(
				res,
				false,
				httpStatus.EXPECTATION_FAILED,
				errorMessage.INVALID_ID,
				version.v1,
				[]
			);
		}
	} catch (error) {
		logger.error(controller, methodName, error, JSON.stringify(error));
		if (error.code == 11000) {
			return customResponse.setResponse(
				res,
				false,
				httpStatus.EXPECTATION_FAILED,
				errorMessage.EMAIL_ALREADY_EXISTS,
				version.v1,
				[]
			);
		}
		return customResponse.setResponse(
			res,
			false,
			httpStatus.INTERNAL_SERVER_ERROR,
			errorMessage.FAILED,
			version.v1,
			error
		);
	}
};

exports.getUser = async (req, res) => {
	const methodName = "[getUsers]";
	try {
		let { userId } = req.params;
		let user = await adminService.userByCriteria({
			_id: mongoose.Types.ObjectId(userId)
		});
		if (user) {
			return customResponse.setResponse(
				res,
				true,
				httpStatus.OK,
				errorMessage.SUCCESS,
				version.v1,
				user
			);
		} else {
			return customResponse.setResponse(
				res,
				false,
				httpStatus.EXPECTATION_FAILED,
				errorMessage.INVALID_ID,
				version.v1,
				[]
			);
		}
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
};

exports.deleteUser = async (req, res) => {
	const methodName = "[deleteUser]";
	try {
		let { userId } = req.params;
		let user = await authService.userByCriteria({
			_id: mongoose.Types.ObjectId(userId)
		});
		if (user) {
			let dataToUpdate = {
				status: "INACTIVE",
				isDeleted: true,
				isActive: false
			};
			await authService.updateUserByCriteria(dataToUpdate, {
				_id: mongoose.Types.ObjectId(userId)
			});
			return customResponse.setResponse(
				res,
				true,
				httpStatus.ACCEPTED,
				errorMessage.SUCCESS,
				version.v1
			);
		} else {
			return customResponse.setResponse(
				res,
				false,
				httpStatus.EXPECTATION_FAILED,
				errorMessage.INVALID_ID,
				version.v1,
				[]
			);
		}
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
};
exports.getUserList = async (req, res) => {
	const methodName = "[getUserList]";
	try {
		let list;
		let { type, page, limit = 10 } = req.body;
		if (page || page === 0) {
			list = await adminService.getUserListForPagination(type, page, limit);
		} else {
			list = await adminService.getUserList(type);
		}
		return customResponse.setResponse(
			res,
			true,
			httpStatus.OK,
			errorMessage.SUCCESS,
			version.v1,
			list
		);
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
};

exports.getPropertyList = async (req, res) => {
	const methodName = "[getPropertyList]";
	try {
		let { page, limit } = req.params;
		let list = await adminService.getPropertyList(page, limit);
		return customResponse.setResponse(
			res,
			true,
			httpStatus.OK,
			errorMessage.SUCCESS,
			version.v1,
			list
		);
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
};

exports.getPropertyDetails = async (req, res) => {
	const methodName = "[getPropertyDetails]";
	try {
		let { propertyId } = req.params;
		let property = await adminService.getProperty({
			_id: mongoose.Types.ObjectId(propertyId)
		});
		if (property) {
			return customResponse.setResponse(
				res,
				true,
				httpStatus.OK,
				errorMessage.SUCCESS,
				version.v1,
				property
			);
		} else {
			return customResponse.setResponse(
				res,
				false,
				httpStatus.EXPECTATION_FAILED,
				errorMessage.INVALID_ID,
				version.v1,
				[]
			);
		}
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
};
exports.getDealList = async (req, res) => {
	const methodName = "[getDealList]";
	try {
		let { page, limit } = req.params;
		let list = await adminService.getDealList(page, limit);
		return customResponse.setResponse(
			res,
			true,
			httpStatus.OK,
			errorMessage.SUCCESS,
			version.v1,
			list
		);
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
};

exports.dealDetails = async (req, res) => {
	const methodName = "[dealDetails]";
	try {
		let { dealId } = req.params;
		let deal = await adminService.getDealDetails({
			_id: mongoose.Types.ObjectId(dealId)
		});
		if (deal) {
			return customResponse.setResponse(
				res,
				true,
				httpStatus.OK,
				errorMessage.SUCCESS,
				version.v1,
				deal
			);
		} else {
			return customResponse.setResponse(
				res,
				false,
				httpStatus.EXPECTATION_FAILED,
				errorMessage.INVALID_ID,
				version.v1,
				[]
			);
		}
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
};

exports.assignPropertyToAgent = async (req, res) => {
	const methodName = "[assignPropertyToAgent]";
	try {
		let { agentId, propertyId } = req.body;
		let criteria = {
			_id: mongoose.Types.ObjectId(propertyId)
		};
		let property = await adminService.getProperty(criteria)
		if(property) {
			let dataToUpdate = {
				isAssignedAgent: true,
				agentId: mongoose.Types.ObjectId(agentId)
			}
			await adminService.assignPropertyToAgent(criteria, dataToUpdate);
			return customResponse.setResponse(
				res,
				true,
				httpStatus.OK,
				errorMessage.SUCCESS,
				version.v1
			);
		}
		return customResponse.setResponse(
			res,
			false,
			httpStatus.EXPECTATION_FAILED,
			errorMessage.INVALID_ID,
			version.v1,
			[]
		);
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
};
