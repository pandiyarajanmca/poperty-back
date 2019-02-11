const express = require('express');
const validate = require('express-validation');
const userController = require('../../../controllers/nosql/user.controller');
const {
    authVerify,
} = require('../../../middlewares/auth');
const {
    getUsers,
} = require('../../../validations/user.validation');
const acl = require('../../../middlewares/acl/acl');

const router = express.Router();

router.route('/user').get(validate(getUsers), authVerify, acl.authorize, userController.getUserList);

module.exports = router;
