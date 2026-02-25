const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/customers', require('./customerRoutes'));
router.use('/workers', require('./workerRoutes'));
router.use('/catalog/products', require('./productRoutes'));
router.use('/catalog/services', require('./serviceRoutes'));
router.use('/catalog/banners', require('./bannerRoutes'));
router.use('/catalog/categories', require('./categoryRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));

// Admin route alias if needed, though create-worker is in workers
// router.use('/admin', require('./adminRoutes')); 

module.exports = router;
