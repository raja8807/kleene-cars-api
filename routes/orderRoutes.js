const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id', OrderController.updateOrder);
router.patch('/:id', OrderController.updateOrder); // Support PATCH as well

module.exports = router;
