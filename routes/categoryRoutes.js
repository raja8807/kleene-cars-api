const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

router.get('/', CategoryController.getCategories);
router.post('/', CategoryController.createCategory);
router.put('/', CategoryController.updateCategory);
router.delete('/', CategoryController.deleteCategory);

module.exports = router;
