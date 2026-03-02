const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

const authenticate = require('../middleware/authMiddleware');

router.get('/', authenticate, OrderController.getOrders);
router.get('/:id', authenticate, OrderController.getOrderById);
router.put('/:id', authenticate, OrderController.updateOrder);
router.patch('/:id', authenticate, OrderController.updateOrder); // Support PATCH as well

module.exports = router;
