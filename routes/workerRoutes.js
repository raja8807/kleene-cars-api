const express = require('express');
const router = express.Router();
const WorkerController = require('../controllers/WorkerController');

router.get('/', WorkerController.getWorkers);
router.post('/create', WorkerController.createWorker);
router.put('/update/:id', WorkerController.updateWorker);

module.exports = router;
