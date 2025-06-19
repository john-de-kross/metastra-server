const rateLimit = require('express-rate-limit');

const otpLimitRate = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many OTP requests. Please try again later'
    }

})

module.exports = otpLimitRate