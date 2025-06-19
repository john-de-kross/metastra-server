const generateOtp = require('../GENERATOR/otpGen');
const Otp = require('../MODELS/otpModel');
const User = require('../MODELS/userModel')
const AppError = require('./ERROR/appError')
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config({ path: './config.env' });


exports.sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!email) return next(new AppError('Email is required',  400))

        if (!user) return next(new AppError('Email is not registered with METASTRA', 404));

        const userOtp = await Otp.findOne({ email });

        if (userOtp) await userOtp.deleteOne();

        const otp = generateOtp();
        await Otp.create({ email, otp });
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            auth: {
                user: process.env.GMAIL, 
                pass: process.env.GMAIL_PASSWORD
            }
            
        })

        const mailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Your OTP Code',
            text: `Your Exclusive METASTRA verification code is here: ${otp}. Hurry, this code is valid for only 10 minutes`
        }

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({
                status: 'success',
                message: 'OTP sent successfully'
            });
            
        } catch (err) {
            next(err);
        }
        


        
    } catch (error) {
        next(error);
    }
}

exports.otpVerification = async (req, res, next) => {
    try {

        const { email, inputOtp } = req.body;
        const record = await Otp.findOne({ email });
        const user = await User.findOne({ email });

        if (!user) return next(new AppError('User not found', 404));
             
        if (!record) {
            return next(new AppError('Verification code error', 400));
        }

        if (record.otp !== inputOtp) return next(new AppError('Verification code error', 400));

        
        user.isVerified = true;
        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {expiresIn: '3h'}
        )

        res.status(200).json({ success: true, message: 'OTP verified successfully', token });

        await Otp.deleteOne({ email });

        
    } catch (error) {
        next(error)
    }
}