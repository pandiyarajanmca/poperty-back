const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const randomstring = require("randomstring");

module.exports = {
    userRole: {
        ADMIN:'ADMIN', 
        USER:'USER', 
        AGENT: 'AGENT'
    },
    tokenType: 'Bearer',
    furnishedType:["NON_FURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"],
    dealStatus:["OPEN","CLOSED","FAILED"],
    propertyType:["RESIDENTIAL", "OFFICE", "COMMERCIAL","LUXURY_RESIDENCE","VILLA","PENTHOUSE","CONDO","SERVICED_APARTMENT"],
    errorMessage: {
        SUCCESS: 'SUCCESS',
        FAILED: 'FAILED',
        ACCESS_DENIED: 'ACCESS_DENIED',
        TOKEN_EXPIRED: 'TOKEN_EXPIRED',
        TOKEN_UNAUTHORIZED: 'TOKEN_UNAUTHORIZED',
        REQUIRED: 'REQUIRED',
        BLOCKED: 'BLOCKED_ACCOUNT',
        EMAIL_NOT_ACTIVATED: 'EMAIL_NOT_ACTIVATED',
        INVALID_PASSWORD: 'INVALID_PASSWORD',
        CHOOSE_NEW_PASSWORD: "Old and new password are same",
        USER_SUCCESSFULLY_REGISTERED: 'USER_SUCCESSFULLY_REGISTERED',
        LOGGED_IN_SUCCESSFULLY: 'USER_SUCCESSFULLY_LOGGEDIN',
        INVALID_USER_NAME: 'INVALID_USER_NAME',
        VALIDATION_ERROR: 'VALIDATION_ERROR',
        NOT_FOUND: 'NOT_FOUND',
        FORGOT_PASSWORD: 'FORGOT_PASSWORD',
        CHANGE_PASSWORD: 'PASSWORD_HAS_BEEN_CHANGED_SUCCESSFULLY',
        EMAIL_VERIFIED: 'EMAIL_VERIFIED',
        EMAIL_ALREADY_EXISTS:"Email already exist!",
        PHONE_ALREADY_EXISTS: "Phone number already exist!",
        SEND_OTP: "Send otp successfully!",
        PHONE_VERIFIED: "Phone number verified succesfully",
        INVALID_OTP: "Invalid Otp",
        AGENT_CREATED: "Agent created successfully",
        AGENT_UPDATED: "Agent updated successfully",
        INVALID_ID: "Invalid id",
    },
    emailTemplateMapping: {
        sendEmailVerificationMail: 'sendEmailVerificationMail',
        sendEmailVerificationMailWithPassword: "sendEmailVerificationMailWithPassword",
        sendForgotPassword: 'sendForgotPassword',
        sendPasswordResetCompleted: 'sendPasswordResetCompleted',
        sendEmailActivated: 'sendEmailActivated',
    },
    version: {
        v1: 'v1.0.0',
        v2: 'v2.0.0',
    },
    adminUser: [
        {
          firstName: "Propertyze",
          lastName: "Admin",
          name: "Propertyze Admin",
          password: bcrypt.hashSync("secret", salt),
          email: "admin@blockgemini.com",
          status: "ACTIVE",
          activationCode: randomstring.generate({ length: 64 }),
          countryCode: 12,
          phoneNumber: 1000000000,
          isActive: true,
          isPhoneVerified: true,
          isEmailVerified: true,
        }
      ],
};
