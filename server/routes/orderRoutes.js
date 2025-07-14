const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');
const {getAllOrders, updateOrderStatus, getOrdersPerDay, createCheckoutSession, getMyOrders } = require('../controllers/orderController');

router.post('/create-checkout-session', authMiddleware, createCheckoutSession);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/', authMiddleware, adminOnly, getAllOrders);
router.put('/:id/status', authMiddleware, adminOnly, updateOrderStatus);
router.get('/orders-per-day', authMiddleware, adminOnly, getOrdersPerDay);

module.exports = router;
