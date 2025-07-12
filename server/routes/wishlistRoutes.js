const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');

const router = express.Router();

router.get('/', authMiddleware, getWishlist);
router.post('/toggle', authMiddleware, toggleWishlist);

module.exports = router;
