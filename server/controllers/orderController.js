const Stripe = require('stripe');
const orderDB = require('../models/orderModel');
require('dotenv').config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


exports.createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body;

    const line_items = items.map(item => {
      if (typeof item.product.price !== 'number') {
        throw new Error(`Invalid price for product ${item.product.title}`);
      }

      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.product.title,
            images: item.product.image ? [item.product.image] : [], 
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      };
    });


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: req.body.userId,
        items: JSON.stringify(items),
      },
    });


    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Checkout Error:', err.message);
    res.status(500).json({ message: err.message });

  }
};

exports.stripeWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const items = JSON.parse(session.metadata.items);
    const userId = session.metadata.userId;


    const order = new orderDB({
      user: userId,
      items,
      shippingAddress: {
        fullName: 'Stripe Checkout',
        address: 'Provided in Stripe Dashboard',
        city: 'N/A',
        postalCode: 'N/A',
        country: 'N/A',
      },
      totalAmount: session.amount_total / 100,
      status: 'Processing',
    });

    order.save();
  }

  res.status(200).json({ received: true });
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderDB.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await orderDB.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Processing', 'Shipped', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await orderDB.findById(id);
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
    const result = await orderDB.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders per day' });
  }
};
