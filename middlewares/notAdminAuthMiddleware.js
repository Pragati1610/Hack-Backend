const Admin = require('../models/auth');
const logger = require('../logging/logger');
const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    try {
        const token = req.get('Authorization');
        const claims = jwt.verify(token, process.env.JWT_PASS);
        if (claims.isAdmin) {
            return res
                .status(403)
                .json({ message: 'Please login as participant' });
        } else {
            req.user = claims;
            next();
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json({ error: err });
    }
};

module.exports = adminAuth;