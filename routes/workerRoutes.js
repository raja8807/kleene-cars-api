const express = require('express');
const router = express.Router();
const WorkerController = require('../controllers/WorkerController');

const authenticate = require('../middleware/authMiddleware');

router.get('/', WorkerController.getWorkers);
router.post('/create', WorkerController.createWorker);
router.put('/update/:id', WorkerController.updateWorker);
router.put('/push-token', authenticate, WorkerController.updateWorkerPushToken);
router.put('/status', authenticate, WorkerController.updateWorkerStatus);

module.exports = router;
