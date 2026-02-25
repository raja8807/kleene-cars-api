const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');

router.get('/', ServiceController.getServices);
router.post('/', ServiceController.createService);
router.put('/', ServiceController.updateService);
router.delete('/', ServiceController.deleteService);

module.exports = router;
