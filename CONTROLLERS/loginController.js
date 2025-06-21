const User = require('../MODELS/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../CONTROLLERS/ERROR/appError')
const dotenv = require('dotenv');

dotenv.config({path: './config.env'})

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return next(new AppError('Invalid email or password', 400));
        }

        
        const isPassword = await bcrypt.compare(password, user.password);
        console.log(user.password)

        if (!isPassword) {
            return next(new AppError('Invalid email or password', 400))
        }

        if (!user.isVerified) {
            return next(new AppError('User is not verified', 401))
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {expiresIn: '3h'}
        )

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'Lax'
        })

        res.status(200).json({
            success: true,
            message: 'User successfully logged in'
        })
       


    } catch (error) {
        next(error)
    }
}