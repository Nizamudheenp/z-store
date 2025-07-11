const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

module.exports =jwtToken