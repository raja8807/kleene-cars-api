const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');

router.get('/', CustomerController.getCustomers);

module.exports = router;
