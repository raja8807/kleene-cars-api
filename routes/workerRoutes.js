const express = require('express');
const router = express.Router();
const WorkerController = require('../controllers/WorkerController');

router.get('/', WorkerController.getWorkers);
router.post('/create', WorkerController.createWorker);

module.exports = router;
