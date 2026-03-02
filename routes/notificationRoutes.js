const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');
const authenticate = require('../middleware/authMiddleware');

router.post('/send', authenticate, notificationController.sendNotification);
router.put('/token', authenticate, notificationController.updatePushToken);

module.exports = router;
