const express = require("express");
const validate = require("express-validation");
const adminController = require("../../../controllers/nosql/admin.controller");
const jwt = require("../../../middlewares/auth");
const {
	createAgent,
	updateAgent,
	getUserDetails,
	getUserList,
	getList,
	getPropertyDetails,
	dealDetails,
	assignPropertyToAgent
} = require("./../../../validations/admin.validation");

const router = express.Router();

router
	.route("/agent")
	.post(validate(createAgent), jwt.authVerify, adminController.createAgent);
router
	.route("/agent/:agentId")
	.put(validate(updateAgent), jwt.authVerify, adminController.updateAgent);
router
	.route("/user/:userId")
	.get(validate(getUserDetails), jwt.authVerify, adminController.getUser)
	.delete(validate(getUserDetails), jwt.authVerify, adminController.deleteUser);
router
	.route("/user-list")
	.post(validate(getUserList), jwt.authVerify, adminController.getUserList);
router
	.route("/property-list/:page/:limit")
	.get(validate(getList), jwt.authVerify, adminController.getPropertyList);
router
	.route("/property/:propertyId")
	.get(
		validate(getPropertyDetails),
		jwt.authVerify,
		adminController.getPropertyDetails
	);
router
	.route("/deal-list/:page/:limit")
	.get(validate(getList), jwt.authVerify, adminController.getDealList);
router
	.route("/deal-details/:dealId")
	.get(validate(dealDetails), jwt.authVerify, adminController.dealDetails);
router
	.route("/assign-property-to-agent")
	.post(
		validate(assignPropertyToAgent),
		jwt.authVerify,
		adminController.assignPropertyToAgent
	);

module.exports = router;
