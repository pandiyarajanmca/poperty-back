const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const sellerController = require('../../../controllers/nosql/seller.controller');
const multipart  = require('connect-multiparty');
const multipartMiddleware = multipart();
const {
    authVerify,
} = require('../../../middlewares/auth');
const {
    postProperty,getProperties,getProperty,deleteProperty,
    updateProperty,uploadImage,listOfInterestedBuyers,
    listDeals,dealDetails
} = require('../../../validations/seller.validation');
const acl = require('../../../middlewares/acl/acl');

//----------------SELLER--------------------//
router.route("/uploadImage").post(validate(uploadImage),multipartMiddleware,sellerController.uploadImage);
router.route('/property').post(validate(postProperty), sellerController.postProperty);
router.route('/properties/:page?/:limit?').get(validate(getProperties), sellerController.getProperties);
router.route('/property/:id').get(validate(getProperty), sellerController.getProperty);
router.route('/property/:id').delete(validate(deleteProperty), sellerController.deleteProperty);
router.route('/property/:id').patch(validate(updateProperty), sellerController.updateProperty);
router.route('/interested-buyers/:id').get(validate(listOfInterestedBuyers), sellerController.listOfInterestedBuyers);
router.route('/deals/:id').get(validate(dealDetails), sellerController.dealDetails);
router.route('/deals/:page?/:limit?').get(validate(listDeals), sellerController.listDeals);
module.exports = router;
