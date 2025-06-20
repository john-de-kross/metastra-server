const express = require('express');

const router = express.Router();

const { createUser } = require('../CONTROLLERS/registrationController');
const { sendOtp, otpVerification } = require('../CONTROLLERS/otpController');
const { loginUser } = require('../CONTROLLERS/loginController');
const { changePassword } = require('../CONTROLLERS/forgetPassController');
const {checkAuth} = require('../CONTROLLERS/checkAuth')
const otpLimitRate = require('../MIDDLEWARE/limitRate')

router.post('/register', createUser); 
router.post('/otp', otpLimitRate, sendOtp);
router.post('/verify', otpVerification); 
router.post('/login', loginUser);
router.get('/check-auth', checkAuth)
router.post('/change-password', changePassword);



module.exports = router; 
