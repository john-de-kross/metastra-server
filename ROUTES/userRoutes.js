const express = require('express');

const router = express.Router();

const { createUser } = require('../CONTROLLERS/registrationController');
const { sendOtp, otpVerification } = require('../CONTROLLERS/otpController');

router.post('/register', createUser);
router.post('/otp', sendOtp);
router.post('/verify', otpVerification);


module.exports = router;