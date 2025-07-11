const userDB = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwtToken = require('../utils/jwt');

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await userDB.findOne({ email });
    if (existing) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userDB({ name, email, password: hashedPassword });
    await user.save();

    const token = jwtToken(user._id, user.role);

    res.status(201).json({ message: 'User registered successfully', user, token });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await userDB.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwtToken(user._id,user.role)

    res.json({ message: 'Login successful', user, token });
};