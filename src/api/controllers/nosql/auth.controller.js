const httpStatus = require('http-status');
const randomstring = require('randomstring')
const customResponse = require('../../utils/response');
const logger = require('../../utils/logger');
const authService = require('../../services/nosql/auth.service');
const mongoose = require("mongoose");
const {
  errorMessage,
  version,
  emailTemplateMapping
} = require('../../../config/constants');
const controller = "[authController]";
const emailService = require('../../utils/email');
const jwt = require('../../middlewares/auth');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const {
  frontHost
} = require('../../../config/vars');
const emailTemplate = require('../../utils/emailTemplate.json');
const twilioService = require('./../../utils/twilioHelper');

exports.register = async (req, res) => {
  const methodName = '[register]'; 
  try {
    let result;
    let reqData = Object.assign({}, req.body);
    reqData.activationCode = randomstring.generate({
      length: 64
    });
    result = await authService.createUser(reqData);
    if (result && result.email) {
      let accountDetails = {
        email: result.email
      }
      // key replace string to be replace and value represents its replaced value;
      let emailVariables = {
        USERNAME: result.firstName,
        ACTIVATE_LINK: `${frontHost}/email-verification?code=` + result.activationCode
      }
      emailService.sendEmailTemplate(
        emailVariables,
        accountDetails,
        emailTemplate[emailTemplateMapping.sendEmailVerificationMail]
      );
      return customResponse.setResponse(res, true, httpStatus.CREATED, errorMessage.USER_SUCCESSFULLY_REGISTERED, version.v1, [result]);

    } else {
      return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, []);
    }

  } catch (error) {
    logger.error(controller, methodName, error,JSON.stringify(error));
    if(error.code == 11000) {
      return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.EMAIL_ALREADY_EXISTS, version.v1, []);
    }
    return customResponse.setResponse(res, false, httpStatus.INTERNAL_SERVER_ERROR, errorMessage.FAILED, version.v1, error);
  }
}

exports.login = async (req, res) => {
  const methodName = '[login]';
  try {
    const reqData = req.body;
    let criteria = {
      email: reqData.email
    }
    let user = await authService.userByCriteria(criteria);
    if (user) {
      //checking user is active or blocked
      if(!user.isEmailVerified){
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.EMAIL_NOT_ACTIVATED, version.v1, {});
      }
      if (!user.isActive) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.BLOCKED, version.v1, {});
      }


      const data = bcrypt.compareSync(reqData.password, user.password);
      if (data) {
        const accessToken = await jwt.generate(user);
        let dataToSend = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          accessToken
        }
        return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.LOGGED_IN_SUCCESSFULLY, version.v1, dataToSend);
      } else {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.INVALID_PASSWORD, version.v1, {});
      }
    } else {
      return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.INVALID_USER_NAME, version.v1, {});
    }
  } catch (error) {
    logger.error(controller, methodName, error);
    return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
  }
}

exports.verifyEmail = async (req, res, next) => {
  const methodName = "[ActivateEmail]";
  try {
    const reqData = req.body;
    let criteria = {
      activationCode: reqData.code
    };
    let user = await authService.userByCriteria(criteria);
    if (user) {
      let dataToUpdate = {
        status: "ACTIVE",
        isEmailVerified: true,
        isActive: true,
        verificationToken: randomstring.generate({
          length: 64
        })
      };
      criteria = {
        email: user.email
      };
      await authService.updateUserByCriteria(dataToUpdate, criteria);
      let accountDetails = {
        email: user.email
      };
      // key replace string to be replace and value represents its replaced value;
      let emailVariables = {
        USERNAME: user.firstName,
        LOGIN_LINK: `${frontHost}`
      };

      emailService.sendEmailTemplate(
        emailVariables,
        accountDetails,
        emailTemplate[emailTemplateMapping.sendEmailActivated]
      );
      return customResponse.setResponse(
        res,
        true,
        httpStatus.OK,
        errorMessage.EMAIL_VERIFIED,
        version.v1,
        { email: user.email }
      );
    } else {
      return customResponse.setResponse(
        res,
        false,
        httpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INVALID_CODE,
        version.v1,
        {}
      );
    }
  } catch (error) {
    logger.error(controller, methodName, error);
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

exports.forgotPassword = async (req, res, next) => {
  const methodName = '[ForgotPassword]';
  try {
    let user = await authService.userByCriteria({ email: req.body.email });
    if (!user) {
      return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.INVALID_EMAIL, version.v1, {});
    } else {
      if(!user.isActive && user.isBlocked){
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.INVALID_EMAIL, version.v1, {});
      }
      ///need to add email
      //sending forgot password  email
      let accountDetails = {
        email: user.email
      }
      // key replace string to be replace and value represents its replaced value;
      let emailVariables = {
        USERNAME: user.firstName,
        ACTIVATE_LINK: `${frontHost}/reset-password?code=` + user.activationCode
      }
      emailService.sendEmailTemplate(
        emailVariables,
        accountDetails,
        emailTemplate[emailTemplateMapping.sendForgotPassword]
      );

      return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.FORGOT_PASSWORD, version.v1, {});
    }
  } catch (error) {
    return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
  }

}


exports.resetPassword = async (req, res, next) => {
  try {
    let password = bcrypt.hashSync(req.body.password, salt);
    let criteria = {
      activationCode: req.body.code
    }
    let user = await authService.userByCriteria(criteria);
    if (user) {
      //sending reset Password  email
      if(!user.isActive && user.isBlocked){
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.INVALID_EMAIL, version.v1, {});
      }

      // const data = bcrypt.compareSync(req.body.password, user.password);
      // if(data){
      //   return customResponse.setResponse(res, false, httpStatus.NOT_ACCEPTABLE, errorMessage.OLD_PASSWORD, version.v1, {});
      // }

      let updateQuery = {
        password: password,
        isEmailVerified: true,
        activationCode: randomstring.generate({
          length: 64
        })
      };
      criteria = {
        uuid: user.uuid
      }

      await authService.updateUserByCriteria(updateQuery, criteria);
      let accountDetails = {
        email: user.email,
      }
      // key replace string to be replace and value represents its replaced value;
      let emailVariables = {
        USERNAME: user.firstName
      }

       emailService.sendEmailTemplate(
        emailVariables,
        accountDetails,
        emailTemplate[emailTemplateMapping.sendPasswordResetCompleted]
      );


      return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.CHANGE_PASSWORD, version.v1, {});
    } else {
      return customResponse.setResponse(res, false, httpStatus.BAD_REQUEST, errorMessage.INVALID_CODE, version.v1, {});
    }

  } catch (error) {
    console.log(error)
    return customResponse.setResponse(res, false, httpStatus.FAILED, errorMessage.FAILED, version.v1, error);
  }
}

exports.changePassword = async (req,res)=>{
  const methodName = '[ChangePassword]';
  try {
    const reqData = req.body;
    let criteria = {
      _id: mongoose.Types.ObjectId(req.decoded.id)
    }
    let user = await authService.userByCriteria(criteria);

    if (user) {

      if(!bcrypt.compareSync(reqData.oldPassword, user.password)){
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.INVALID_PASSWORD, version.v1, {});
      }
      if(bcrypt.compareSync(reqData.newPassword, user.password)){
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.CHOOSE_NEW_PASSWORD, version.v1, {});
      }

      let dataToUpdate = {
        password: bcrypt.hashSync(reqData.newPassword,salt)
      }
      criteria = {
        id: user.id
      }
      await authService.updateUserByCriteria(dataToUpdate, criteria);
      
      return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.CHANGE_PASSWORD, version.v1, {});
    } else {
      return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.INVALID_CODE, version.v1, {});
    }

  } catch (error) {
    console.log(error)
    logger.error(controller, methodName, error)
    return customResponse.setResponse(res, false, httpStatus.FAILED, errorMessage.FAILED, version.v1, error);
  }
}

exports.resendEmailVerification = async (req, res, next) => {
  const methodName = '[resendEmailVerification]';
  try {
    let user = await authService.userByCriteria({ email: req.body.email });
    if (!user) {
      return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.INVALID_EMAIL, version.v1, {});
    } else {
      if (!user.isActive || user.isBlocked) {
        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.BLOCKED, version.v1, {});
      }else if (!user.isEmailVerified) {

        //sending activation email
        let accountDetails = {
          email: user.email,
        }

        // key replace string to be replace and value represents its replaced value;
        let emailVariables = {
          USERNAME: user.firstName,
          ACTIVATE_LINK: `${frontHost}/email-verification?code=` + user.activationCode
        }
        emailService.sendEmailTemplate(
          emailVariables,
          accountDetails,
          emailTemplate[emailTemplateMapping.sendEmailVerificationMail]
        );

        return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.VERIFICATION_LINK_SENT, version.v1, {});
      }else{
        return customResponse.setResponse(res, false, httpStatus.BAD_REQUEST, errorMessage.EMAIL_ALREADY_ACTIVATED, version.v1, {});
      }
    }
  } catch (error) {
    logger.error(controller, methodName, error,JSON.stringify(error));
    return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
  }

}

exports.checkEmailExist = async (req, res) => {
  const methodName = '[checkEmailExist]';
  try {
     let emailData = await authService.userByCriteria({ email: req.body.email });
     return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SUCCESS, version.v1, (emailData ? true : false ));
  } catch (error){
    logger.error(controller, methodName, error);
    return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
  }
}

exports.sendOtp = async (req, res) => {
  const methodName = '[sendOtp]';
  try {
    const reqData = req.body;
    let criteria = {
      _id: mongoose.Types.ObjectId(req.decoded.id)
    }
    let user = await authService.userByCriteria(criteria);
    if (user) {
      let otp = randomstring.generate({ length: 6, charset: "numeric"});
      let message = `Your Propertyze verification code is: ${otp}`;
      let to = `+${reqData.countryCode}${reqData.phoneNumber}`;
      await authService.updateUserByCriteria({
        phoneNumber: reqData.phoneNumber,
        countryCode: reqData.countryCode,
        otp
      }, criteria);
      await twilioService.sendMessage(message, to);
      return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.SEND_OTP, version.v1, {});
    } else {
      return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.INVALID_CODE, version.v1, {});
    }

  } catch (error) {
    logger.error(controller, methodName, error)
    return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.FAILED, version.v1, error);
  }
}

exports.verifyPhone = async (req, res) => {
  const methodName = '[verifyPhone]';
  try {
    const reqData = req.body;
    let criteria = {
      _id: mongoose.Types.ObjectId(req.decoded.id),
      otp: reqData.otp
    }
    let user = await authService.userByCriteria(criteria);
    if (user) {
      let otp = randomstring.generate({ length: 6, charset: "numeric"});
      await authService.updateUserByCriteria({
        otp,
        isPhoneVerified: true
      }, criteria);
      return customResponse.setResponse(res, true, httpStatus.OK, errorMessage.PHONE_VERIFIED, version.v1, {});
    } else {
      return customResponse.setResponse(res, false, httpStatus.EXPECTATION_FAILED, errorMessage.INVALID_OTP, version.v1, {});
    }

  } catch (error) {
    logger.error(controller, methodName, error)
    return customResponse.setResponse(res, false, httpStatus.FAILED, errorMessage.FAILED, version.v1, error);
  }
}