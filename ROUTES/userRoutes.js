const express = require('express');

const router = express.Router();

const { createUser } = require('../CONTROLLERS/registrationController');
const { sendOtp, otpVerification } = require('../CONTROLLERS/otpController');
const {loginUser} = require('../CONTROLLERS/loginController')

router.post('/register', createUser);
router.post('/otp', sendOtp);
router.post('/verify', otpVerification);
router.post('/login', loginUser)


module.exports = router; 
