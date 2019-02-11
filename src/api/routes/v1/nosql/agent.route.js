const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const agentController = require('../../../controllers/nosql/agent.controller');
const {
    listProperties,
    verifyProperty,
    updateProperty,
    listInterestedBuyers,
    getInterestedBuyerDetails,
    createDeal,
    listDeals,
    getDealDetails,
    updateDeal,
    getAgentRating
} = require('../../../validations/agent.validation');


//----------------PROPERTIES--------------------//
router.route('/list-properties/:page?/:limit?').get(validate(listProperties), agentController.listProperties);
router.route('/verify-property/:id').post(validate(verifyProperty), agentController.verifyProperty);
router.route('/update-property/:id').post(validate(updateProperty), agentController.updateProperty);

//----------------BUYERS--------------------//
router.route('/list-interested-buyers/:propertyId').get(validate(listInterestedBuyers), agentController.listInterestedBuyers);
router.route('/interested-buyer-details/:id').get(validate(getInterestedBuyerDetails), agentController.getInterestedBuyerDetails); //PRANAV_CHECK IF propertyId is required

//----------------DEALS--------------------//
router.route('/deal').post(validate(createDeal), agentController.createDeal);
router.route('/deal/list/:propertyId').get(validate(listDeals), agentController.listDeals);
router.route('/deal/details/:id').get(validate(getDealDetails), agentController.getDealDetails);
router.route('/deal/update/:id').post(validate(updateDeal), agentController.updateDeal);

//----------------RATINGS--------------------//
router.route('/rating').get(validate(getAgentRating), agentController.getAgentRating);

module.exports = router;
