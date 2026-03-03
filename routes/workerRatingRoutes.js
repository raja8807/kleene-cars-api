const express = require('express');
const router = express.Router();
const workerRatingController = require('../controllers/WorkerRatingController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, workerRatingController.createRating);
router.get('/order/:orderId', authenticate, workerRatingController.getRatingByOrder);

module.exports = router;