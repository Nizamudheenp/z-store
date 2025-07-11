const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    if(db) console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;
