const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
connectDB();

const authRoute = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));