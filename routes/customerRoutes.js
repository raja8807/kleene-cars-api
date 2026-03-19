const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
const { getIsWithinRadius } = require('../controllers/AddressController');

router.get('/', CustomerController.getCustomers);
router.post('/checkAvailability', getIsWithinRadius);

module.exports = router;
