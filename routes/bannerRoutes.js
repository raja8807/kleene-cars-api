const express = require('express');
const router = express.Router();
const BannerController = require('../controllers/BannerController');

router.get('/', BannerController.getBanners);
router.post('/', BannerController.createBanner);
router.delete('/', BannerController.deleteBanner);

module.exports = router;
