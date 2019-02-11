const User = require('../../models/nosql/user.model');
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);


exports.createUser = (reqData) => {
    reqData.password = bcrypt.hashSync(reqData.password, salt);
    reqData.name = reqData.firstName + " " + reqData.lastName;
    return User.create(reqData);
}

exports.userByCriteria = (criteria) => {
    return User.findOne(criteria).lean();
}

exports.updateUserByCriteria = (dataToUpdate, criteria) => {
    return User.updateOne(criteria, dataToUpdate);
}