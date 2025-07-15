const cartDB = require('../models/cartModel');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    let cart = await cartDB.findOne({ user: userId });

    if (!cart) {
      cart = new cartDB({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const index = cart.items.findIndex(item => item.product.toString() === productId);
      if (index >= 0) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await cartDB.findOne({ user: req.user._id }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await cartDB.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.json({ message: 'Item removed', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item' });
  }
};
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await cartDB.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i.product.toString() === productId);

    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    item.quantity = quantity;

    await cart.save();

    res.json({ message: 'Quantity updated', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error updating quantity' });
  }
};

