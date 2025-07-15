const express = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');
const { createPaymentIntent, createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrdersPerDay } = require('../controllers/orderController');
const router = express.Router();

router.post('/create-payment-intent', authMiddleware, createPaymentIntent);
router.post('/create', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/', authMiddleware, adminOnly, getAllOrders);
router.put('/:id/status', authMiddleware, adminOnly, updateOrderStatus);
router.get('/charts/orders-per-day', authMiddleware, adminOnly, getOrdersPerDay);

module.exports = router;
