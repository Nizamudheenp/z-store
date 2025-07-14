const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
connectDB();
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

const stripeWebhookRoute = require('./routes/stripeWebhookRoute');
app.use('/api/webhook', stripeWebhookRoute); 


app.use(express.json());

const authRoute = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');



app.use('/api/auth', authRoute);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
