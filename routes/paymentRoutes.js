const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
// const authMiddleware = require('../middleware/authMiddleware'); // Assuming there's one

router.post('/', PaymentController.createPayment);
router.patch('/:id/status', PaymentController.updatePaymentStatus);
router.get('/order/:order_id', PaymentController.getPaymentByOrderId);
router.get('/', PaymentController.getAllPayments);

module.exports = router;
