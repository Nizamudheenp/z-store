const userDB = require('../models/userModel');
const productDB = require('../models/productModel');

exports.toggleWishlist = async (req, res) => {
  try {
    const user = await userDB.findById(req.user._id);
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ message: 'Product ID required' });

    const exists = user.wishlist.includes(productId);

    if (exists) {
      user.wishlist.pull(productId); 
    } else {
      user.wishlist.push(productId); 
    }

    await user.save();

    res.json({
      message: exists ? 'Removed from wishlist' : 'Added to wishlist',
      wishlist: user.wishlist,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update wishlist' });
  }
}

exports.getWishlist = async (req, res) => {
  try {
    const user = await userDB.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};