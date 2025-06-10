const mongoose = require('mongoose');


const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    otp: {
        type: string,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
})

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;