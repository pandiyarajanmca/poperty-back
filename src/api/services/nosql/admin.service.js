const mongoose = require("mongoose");
const User = require("./../../models/nosql/user.model");
const Deals = require("./../../models/nosql/deal.model");
const Property = require("./../../models/nosql/propertyDetails.model");
const PropertyImages = require("./../../models/nosql/propertyImages.model");

const createAgent = data => {
	return User.create(data);
};

const updateAgent = (criteria, data) => {
	return User.updateOne(criteria, data);
};

const deleteUser = id => {
	let dataToUpdate = {
		isActive: false,
		isDeleted: true,
		status: "INACTIVE"
	};
	return User.updateOne(
		{
			_id: mongoose.Types.ObjectId(id)
		},
		dataToUpdate
	);
};

const userByCriteria = criteria => {
	return User.findOne(criteria, {
		_id: 1,
		email: 1,
		firstName: 1,
		lastName: 1,
		phoneNumber: 1,
		countryCode: 1,
		profilePic: 1,
		status: 1,
		role: 1
	}).lean();
};

const getUserList = role => {
	let criteria = {
		role,
		isActive: true,
		status: "ACTIVE",
		isDeleted: false
	};
	return User.find(criteria, {
		_id: 1,
		email: 1,
		firstName: 1,
		lastName: 1,
		phoneNumber: 1,
		countryCode: 1,
		profilePic: 1,
		status: 1,
		role: 1
	}).lean();
};

const getUserListForPagination = async (type, page, limit) => {
	let criteria = {
		role: type,
		isActive: true,
		status: "ACTIVE",
		isDeleted: false
	};
	let total = await User.count(criteria);
	let list = await User.find(criteria, {
		_id: 1,
		email: 1,
		firstName: 1,
		lastName: 1,
		phoneNumber: 1,
		countryCode: 1,
		profilePic: 1,
		status: 1,
		role: 1
	})
		.skip(page * limit)
		.limit(limit)
		.lean();
	return {
		total,
		list
	};
};

const getPropertyList = async (page, limit) => {
	let count = await Property.count({});
	let list = await Property.find({})
		.skip(page * limit)
		.limit(limit)
		.lean();
	let ids = list.map(property => property._id);
	let images = await PropertyImages.aggregate([
		{
			$match: { propertyId: { $in: ids } }
		},
		{
			$group: {
				_id: "$propertyId",
				images: {
					$push: { url: "$url", metadata: "$metadata", title: "$title" }
				}
			}
		}
	]);
	list = list.map(property => {
		let { _id } = property;
		let obj = images.find(o => o._id == _id);
		if (obj) {
			property.images = obj.images;
		}
		return property;
	});
	return {
		count,
		list
	};
};

const getProperty = async criteria => {
	let property = await Property.findOne(criteria).lean();
	let images = await PropertyImages.find(
		{ propertyId: property._id },
		{ url: 1, metadata: 1, title: 1 }
	).lean();
	property.images = images;
	return property;
};

const getDealList = async (page, limit) => {
	let count = await Deals.count({});
	let list = await Deals.find({})
		.populate({
			path: "buyerId",
			select:"-password"
		})
		.populate({
			path: "sellerId",
			select:"-password"
		})
		.populate("propertyId")
		.populate({
			path: "agentId",
			select:"-password"
		})
		.skip(page * limit)
		.limit(limit)
		.lean();
	return {
		count,
		list
	}
};
const getDealDetails = (criteria) => {
	return Deals.findOne(criteria)
		.populate({
			path: "buyerId",
			select:"-password"
		})
		.populate({
			path: "sellerId",
			select:"-password"
		})
		.populate("propertyId")
		.populate({
			path: "agentId",
			select:"-password"
		})
		.lean();
};

const assignPropertyToAgent = (criteria, dataToUpdate) => {
	return Property.updateOne(criteria, dataToUpdate);
}

module.exports = {
	createAgent,
	updateAgent,
	deleteUser,
	getUserList,
	userByCriteria,
	getUserListForPagination,
	getProperty,
	getPropertyList,
	getDealList,
	getDealDetails,
	assignPropertyToAgent
};
