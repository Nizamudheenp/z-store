const express = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');
const { createPaymentIntent, createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const router = express.Router();

router.post('/create-payment-intent', authMiddleware, createPaymentIntent);
router.post('/create', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/', authMiddleware, adminOnly, getAllOrders);
router.put('/:id/status', authMiddleware, adminOnly, updateOrderStatus);

module.exports = router;
