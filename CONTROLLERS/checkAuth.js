const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AppError = require('./ERROR/appError');

dotenv.config({ path: './config.env' });
exports.checkAuth = async (req, res,next) => {
    const token = req.cookies.jwt;
    if (!token) return next(new AppError('User not authenticated', 401));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({
            authenticated: true,
            user: decoded

        })
    } catch (error) {
        return next(AppError('User not authenticated', 401));
    }
}