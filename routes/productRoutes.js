const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.get('/', ProductController.getProducts);
router.post('/', ProductController.createProduct);
router.put('/', ProductController.updateProduct);
router.delete('/', ProductController.deleteProduct);

module.exports = router;
