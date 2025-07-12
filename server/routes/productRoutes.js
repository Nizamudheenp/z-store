const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getTopSellingProducts } = require('../controllers/productController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const router = express.Router();



router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', authMiddleware, adminOnly, upload.single('image'), createProduct);
router.put('/:id', authMiddleware, adminOnly, updateProduct);
router.delete('/:id', authMiddleware, adminOnly, deleteProduct);
router.get('/top-products', authMiddleware, adminOnly, getTopSellingProducts);

module.exports = router;
