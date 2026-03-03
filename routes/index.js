const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authMiddleware');
const { restrictToAdminOnly, isAdmin } = require('../middleware/roleMiddleware');

router.use('/auth', require('./authRoutes'));
router.use('/customers', authenticate, require('./customerRoutes'));
router.use('/workers', authenticate, require('./workerRoutes'));

// Catalog is restricted to main admins only
router.use('/catalog/products', authenticate, restrictToAdminOnly, require('./productRoutes'));
router.use('/catalog/services', authenticate, restrictToAdminOnly, require('./serviceRoutes'));
router.use('/catalog/banners', authenticate, restrictToAdminOnly, require('./bannerRoutes'));
router.use('/catalog/categories', authenticate, restrictToAdminOnly, require('./categoryRoutes'));

router.use('/orders', require('./orderRoutes'));
router.use('/dashboard', authenticate, require('./dashboardRoutes'));

router.use('/admins', authenticate, isAdmin, require('./adminRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/ratings', require('./workerRatingRoutes'));

module.exports = router;
