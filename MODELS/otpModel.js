const mongoose = require('mongoose');


const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    otp: {
        type: String,
        required: true
    },

    numOtpSent: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
})

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;