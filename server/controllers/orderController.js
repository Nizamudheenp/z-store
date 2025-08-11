const Stripe = require('stripe');
const OrderDB = require('../models/orderModel');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const productDB = require('../models/productModel');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { items } = req.body;

    let totalAmount = 0;

    for (const item of items) {
      const product = await productDB.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      totalAmount += product.price * item.quantity;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'inr',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};


exports.createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, totalAmount, paymentIntentId } = req.body;

    const order = new OrderDB({
      user: userId,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
      })),
      shippingAddress,
      totalAmount,
      paymentIntentId,
      status: 'Processing',
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await OrderDB.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title image price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrderDB.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await OrderDB.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};

exports.getOrdersPerDay = async (req, res) => {
  try {
    const result = await OrderDB.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders per day' });
  }
};


