const express = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');
const { createPaymentIntent, placeOrder, getAllOrders, updateOrderStatus, getOrdersPerDay } = require('../controllers/orderController');

const router = express.Router();

router.post('/create-payment-intent', authMiddleware, createPaymentIntent);
router.post('/place-order', authMiddleware, placeOrder);
router.get('/', authMiddleware, adminOnly, getAllOrders);
router.put('/:id/status', authMiddleware, adminOnly, updateOrderStatus);
router.get('/orders-per-day', authMiddleware, adminOnly, getOrdersPerDay);

module.exports = router;
