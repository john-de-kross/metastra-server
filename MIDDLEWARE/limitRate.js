const rateLimit = require('express-rate-limit');

const otpLimitRate = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many requests. Please try again after 15 minutes'
    }

})

module.exports = otpLimitRate