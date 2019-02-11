const express = require('express');

const router = express.Router();
const {
    mongo
} = require('../../../config/vars');


if (mongo.enabled === 'true') {
    const userRoutes = require('./nosql/user.route');
    const authRoutes = require('./nosql/auth.route');
    const agentRoutes = require('./nosql/agent.route');
    const adminRoutes = require('./nosql/admin.route');
    const sellerRoutes = require('./nosql/seller.route');
    router.use('/admin', adminRoutes);
    router.use('/user', userRoutes);
    router.use('/auth', authRoutes);
    router.use('/agent', agentRoutes);
    router.use('/seller', sellerRoutes);
}

module.exports = router;
