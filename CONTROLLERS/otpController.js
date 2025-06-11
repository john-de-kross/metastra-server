const generateOtp = require('../GENERATOR/otpGen');
const Otp = require('../MODELS/otpModel');
const User = require('../MODELS/userModel')
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config({ path: './config.env' });


exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
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
            text: `Your OTP code to complete your verification is ${otp}.It will expire in 10 minutes`
        }

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({
                status: 'success',
                message: 'OTP sent successfully'
            })
        } catch (err) {
            return res.status(500).json({
                status: 'fail',
                message: 'Failed to send OTP',
                error: err.message
            })
        }
        


        
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Failed to generate OTP',
            error: error.message
        })
    }
}

exports.otpVerification = async (req, res, next) => {
    try {

        const { email, inputOtp } = req.body;
        const record = await Otp.findOne({ email });
        const user = await User.findOne({ email });
        
        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'OTP expired or not found '
            })
        }

        if (record.otp !== inputOtp) return res.status(400).json({ success: false, message: 'Invalid OTP' });


        await Otp.deleteOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found' 
            })
            
        }
        
        user.isVerified = true;
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            {expiresIn: '3h'}
        )


        res.status(200).json({ success: true, message: 'OTP verified successfully', token });

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
            error: error.message
        })
    }
}