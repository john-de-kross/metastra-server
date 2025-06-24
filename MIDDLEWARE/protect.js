const jwt = require('jsonwebtoken');
const AppError = require('../CONTROLLERS/ERROR/appError');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

exports.protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return next(new AppError('User is unauthenticated', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next()
    } catch (err) {
        next(new AppError('Access denied! User unauthenticated', 403))
    }
}