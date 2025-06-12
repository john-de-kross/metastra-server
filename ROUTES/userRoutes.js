const express = require('express');

const router = express.Router();

const { createUser } = require('../CONTROLLERS/registrationController');
const { sendOtp, otpVerification } = require('../CONTROLLERS/otpController');
const { loginUser } = require('../CONTROLLERS/loginController');
const {changePassword} = require('../CONTROLLERS/forgetPassController')

router.post('/register', createUser);
router.post('/otp', sendOtp);
router.post('/verify', otpVerification);
router.post('/login', loginUser);
router.post('/change-password', changePassword);


module.exports = router; 
