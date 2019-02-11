const express = require('express');
const validate = require('express-validation');
const authController = require('../../../controllers/nosql/auth.controller');
const jwt = require('../../../middlewares/auth');
const {
  register,
  verifyEmail,
  login,
  changePassword,
  resetPassword,
  forgotPassword,
  resendEmailVerification,
  checkEmailExist,
  sendOtp,
  verifyPhone
} = require('../../../validations/auth.validation');

const router = express.Router();
router.route('/register').post(validate(register), authController.register);
router.route('/activate').put(validate(verifyEmail), authController.verifyEmail);
router.route('/login').post(validate(login), authController.login);
router.route('/change-password').put(validate(changePassword),jwt.authVerify, authController.changePassword);
router.route('/forgot-password').post(validate(forgotPassword), authController.forgotPassword);
router.route('/reset-password').post(validate(resetPassword), authController.resetPassword);
router.route('/resend').post(validate(resendEmailVerification), authController.resendEmailVerification);
router.route('/check/email').post(validate(checkEmailExist), authController.checkEmailExist);
router.route('/send-otp').post(validate(sendOtp), jwt.authVerify, authController.sendOtp);
router.route('/verify-phone').put(validate(verifyPhone), jwt.authVerify, authController.verifyPhone);
module.exports = router;
