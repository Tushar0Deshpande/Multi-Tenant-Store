const express = require('express');
const router = express.Router();
// Ensure these are only imported ONCE
const { getProducts, addProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

// GET all products (Tenant isolated)
router.get('/', auth, getProducts);

// POST add a product
router.post('/', auth, addProduct);

// DELETE a product (Manager/Admin logic handled in controller)
router.delete('/:id', auth, deleteProduct);

module.exports = router;