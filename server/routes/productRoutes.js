const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getTopSellingProducts, getCategories, getInventory } = require('../controllers/productController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const router = express.Router();

router.get('/inventory', authMiddleware, adminOnly, getInventory);
router.get('/categories', getCategories);
router.get('/top-products', authMiddleware, adminOnly, getTopSellingProducts);
router.get('/:id', getProductById);
router.get('/', getProducts);


router.post('/', authMiddleware, adminOnly, upload.single('image'), createProduct);
router.put('/:id', authMiddleware, adminOnly, updateProduct);
router.delete('/:id', authMiddleware, adminOnly, deleteProduct);

module.exports = router;
